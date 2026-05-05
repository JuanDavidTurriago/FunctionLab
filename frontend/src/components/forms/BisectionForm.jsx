import { useState } from 'react';

const initialState = {
  functionExpression: 'x^3 - x - 2',
  left: '1',
  right: '2',
  tolerance: '0.000001',
  maxIterations: '50',
};

export default function BisectionForm({ loading, onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      functionExpression: form.functionExpression,
      left: Number(form.left),
      right: Number(form.right),
      tolerance: Number(form.tolerance),
      maxIterations: Number(form.maxIterations),
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="bisectionFunction">Funcion f(x)</label>
        <input id="bisectionFunction" name="functionExpression" value={form.functionExpression} onChange={handleChange} />
      </div>
      <div className="inline-fields">
        <div className="form-field">
          <label htmlFor="left">a</label>
          <input id="left" name="left" type="number" step="any" value={form.left} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="right">b</label>
          <input id="right" name="right" type="number" step="any" value={form.right} onChange={handleChange} />
        </div>
      </div>
      <div className="inline-fields">
        <div className="form-field">
          <label htmlFor="bisectionTolerance">Tolerancia</label>
          <input id="bisectionTolerance" name="tolerance" type="number" step="any" value={form.tolerance} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="bisectionMaxIterations">Iteraciones</label>
          <input id="bisectionMaxIterations" name="maxIterations" type="number" min="1" value={form.maxIterations} onChange={handleChange} />
        </div>
      </div>
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Calculando...' : 'Calcular biseccion'}
      </button>
    </form>
  );
}
