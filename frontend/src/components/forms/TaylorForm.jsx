import { useState } from 'react';

const initialState = {
  functionExpression: 'sin(x)',
  point: '0',
  value: '0.5',
  order: '5',
};

export default function TaylorForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initialState);

  const handleChange = ({ target }) => {
    setForm((current) => ({
      ...current,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Los inputs HTML guardan texto; el contrato de la API espera valores numericos.
    onSubmit({
      functionExpression: form.functionExpression,
      point: Number(form.point),
      value: Number(form.value),
      order: Number(form.order),
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="functionExpression">Funcion</label>
        <input
          id="functionExpression"
          name="functionExpression"
          value={form.functionExpression}
          onChange={handleChange}
          placeholder="sin(x)"
        />
      </div>
      <div className="form-field">
        <label htmlFor="point">Punto de expansion</label>
        <input id="point" name="point" type="number" step="any" value={form.point} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="value">Valor a evaluar</label>
        <input id="value" name="value" type="number" step="any" value={form.value} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="order">Orden</label>
        <input id="order" name="order" type="number" min="0" value={form.order} onChange={handleChange} />
      </div>
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Calculando...' : 'Calcular serie de Taylor'}
      </button>
    </form>
  );
}
