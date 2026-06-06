import { useState } from 'react';

const initialState = {
  functionExpression: 'x^3 - x - 2',
  initialGuess: '1.5',
  tolerance: '0.000001',
  maxIterations: '25',
};

export default function NewtonForm({ loading, onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // La expresion permanece como texto y los parametros iterativos pasan a numeros.
    onSubmit({
      functionExpression: form.functionExpression,
      initialGuess: Number(form.initialGuess),
      tolerance: Number(form.tolerance),
      maxIterations: Number(form.maxIterations),
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="newtonFunction">Funcion f(x)</label>
        <input id="newtonFunction" name="functionExpression" value={form.functionExpression} onChange={handleChange} />
      </div>
      <div className="inline-fields">
        <div className="form-field">
          <label htmlFor="initialGuess">x0</label>
          <input id="initialGuess" name="initialGuess" type="number" step="any" value={form.initialGuess} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="newtonTolerance">Tolerancia</label>
          <input id="newtonTolerance" name="tolerance" type="number" step="any" value={form.tolerance} onChange={handleChange} />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="newtonMaxIterations">Iteraciones maximas</label>
        <input id="newtonMaxIterations" name="maxIterations" type="number" min="1" value={form.maxIterations} onChange={handleChange} />
      </div>
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Calculando...' : 'Calcular Newton'}
      </button>
    </form>
  );
}
