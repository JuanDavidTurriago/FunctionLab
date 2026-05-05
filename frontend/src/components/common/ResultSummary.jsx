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
          <dd>{formatValue(item.value)}</dd>
        </div>
      ))}
    </dl>
  );
}
