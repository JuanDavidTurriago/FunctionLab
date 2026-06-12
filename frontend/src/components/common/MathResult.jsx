import MathFormula from './MathFormula';

export default function MathResult({ formulas, ariaLabel = 'Resultado matematico' }) {
  const validFormulas = formulas.filter(Boolean);

  if (!validFormulas.length) {
    return null;
  }

  return (
    <div className="math-result" aria-label={ariaLabel}>
      {validFormulas.map((formula, index) => (
        <div className="math-result-line" key={`${index}-${formula}`}>
          <MathFormula latex={formula} display />
        </div>
      ))}
    </div>
  );
}
