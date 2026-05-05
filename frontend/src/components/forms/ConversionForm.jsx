import { useState } from 'react';

const initialState = {
  value: '101101',
  fromBase: '2',
  toBase: '10',
};

export default function ConversionForm({ loading, onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      value: form.value,
      fromBase: Number(form.fromBase),
      toBase: Number(form.toBase),
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="conversionValue">Valor</label>
        <input id="conversionValue" name="value" value={form.value} onChange={handleChange} />
      </div>
      <div className="inline-fields">
        <div className="form-field">
          <label htmlFor="fromBase">Base origen</label>
          <input id="fromBase" name="fromBase" type="number" min="2" max="36" value={form.fromBase} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="toBase">Base destino</label>
          <input id="toBase" name="toBase" type="number" min="2" max="36" value={form.toBase} onChange={handleChange} />
        </div>
      </div>
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Convirtiendo...' : 'Convertir'}
      </button>
    </form>
  );
}
