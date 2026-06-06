import { useState } from 'react';

const initialState = {
  f1: 'x^2 + y^2 - 4',
  f2: 'x - y - 1',
  x0: '1.8',
  y0: '0.8',
  tolerance: '0.000001',
  maxIterations: '25',
};

export default function SystemNewtonForm({ loading, onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Las dos funciones son simbolicas; punto inicial, tolerancia e iteraciones son numericos.
    onSubmit({
      f1: form.f1,
      f2: form.f2,
      x0: Number(form.x0),
      y0: Number(form.y0),
      tolerance: Number(form.tolerance),
      maxIterations: Number(form.maxIterations),
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="systemF1">f1(x,y)</label>
        <input id="systemF1" name="f1" value={form.f1} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="systemF2">f2(x,y)</label>
        <input id="systemF2" name="f2" value={form.f2} onChange={handleChange} />
      </div>
      <div className="inline-fields">
        <div className="form-field">
          <label htmlFor="systemX0">x0</label>
          <input id="systemX0" name="x0" type="number" step="any" value={form.x0} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="systemY0">y0</label>
          <input id="systemY0" name="y0" type="number" step="any" value={form.y0} onChange={handleChange} />
        </div>
      </div>
      <div className="inline-fields">
        <div className="form-field">
          <label htmlFor="systemTolerance">Tolerancia</label>
          <input id="systemTolerance" name="tolerance" type="number" step="any" value={form.tolerance} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="systemMaxIterations">Iteraciones</label>
          <input id="systemMaxIterations" name="maxIterations" type="number" min="1" value={form.maxIterations} onChange={handleChange} />
        </div>
      </div>
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Calculando...' : 'Resolver sistema'}
      </button>
    </form>
  );
}
