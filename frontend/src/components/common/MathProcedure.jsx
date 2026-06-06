import { useEffect, useState } from 'react';
import { MathJax } from 'better-react-mathjax';

export default function MathProcedure({ procedure }) {
  const [open, setOpen] = useState(false);
  const procedureKey = procedure?.formulas?.join('|') ?? '';

  useEffect(() => {
    setOpen(false);
  }, [procedureKey]);

  if (!procedure?.formulas?.length) {
    return null;
  }

  return (
    <div className="math-procedure">
      <button
        className="btn-secondary"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? 'Ocultar procedimiento' : 'Ver procedimiento'}
      </button>

      {open && (
        <div className="math-procedure-content">
          {procedure.formulas.map((formula, index) => (
            <div className="math-step" key={`${index}-${formula.slice(0, 24)}`}>
              <span className="math-step-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="math-formula">
                <MathJax key={formula} dynamic>
                  {`\\[${formula}\\]`}
                </MathJax>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
