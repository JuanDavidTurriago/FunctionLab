import MathFormula from './MathFormula';

const formatValue = (value) => {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : Number(value.toFixed(8));
  }

  return value ?? '-';
};

export default function ResultSummary({ items }) {
  return (
    <dl className="result-summary">
      {items.map((item) => (
        <div key={item.label} className="result-item">
          <dt>{item.label}</dt>
          <dd className={item.latex ? 'result-value-math' : ''}>
            {item.latex ? <MathFormula latex={item.latex} /> : formatValue(item.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
