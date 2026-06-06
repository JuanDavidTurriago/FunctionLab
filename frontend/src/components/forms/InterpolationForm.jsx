import { useState } from 'react';
import { parsePoints } from '../../utils/parsePoints';

const initialState = {
  method: 'lagrange',
  pointsText: '0,1\n1,3\n2,2',
  value: '1.5',
};

export default function InterpolationForm({ loading, onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Cada linea "x,y" se transforma en un punto antes de enviarla al backend.
    onSubmit(form.method, {
      points: parsePoints(form.pointsText),
      value: Number(form.value),
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="segmented-control" role="radiogroup" aria-label="Metodo de interpolacion">
        <label>
          <input type="radio" name="method" value="lagrange" checked={form.method === 'lagrange'} onChange={handleChange} />
          Lagrange
        </label>
        <label>
          <input type="radio" name="method" value="newton" checked={form.method === 'newton'} onChange={handleChange} />
          Newton
        </label>
      </div>
      <div className="form-field">
        <label htmlFor="pointsText">Puntos x,y</label>
        <textarea id="pointsText" name="pointsText" rows="5" value={form.pointsText} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="interpolationValue">Evaluar en x</label>
        <input id="interpolationValue" name="value" type="number" step="any" value={form.value} onChange={handleChange} />
      </div>
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Calculando...' : 'Interpolar'}
      </button>
    </form>
  );
}
