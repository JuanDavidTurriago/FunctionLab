import { useState } from 'react';

const initialState = {
  mode: 'base',
  value: '10101',
  fromBase: '2',
  toBase: '10',
  precision: '16',
  actualValue: 'pi',
  approximateValue: '22/7',
};

export default function ConversionForm({ loading, onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Cada modo genera un payload distinto para el mismo endpoint.
    if (form.mode === 'error') {
      onSubmit({
        mode: 'error',
        actualValue: form.actualValue,
        approximateValue: form.approximateValue,
      });
      return;
    }

    onSubmit({
      mode: 'base',
      value: form.value,
      fromBase: Number(form.fromBase),
      toBase: Number(form.toBase),
      precision: Number(form.precision),
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="segmented-control" role="radiogroup" aria-label="Tipo de calculo">
        <label>
          <input type="radio" name="mode" value="base" checked={form.mode === 'base'} onChange={handleChange} />
          Bases
        </label>
        <label>
          <input type="radio" name="mode" value="error" checked={form.mode === 'error'} onChange={handleChange} />
          Errores
        </label>
      </div>

      {form.mode === 'base' ? (
        <>
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
          <div className="form-field">
            <label htmlFor="precision">Digitos fraccionarios maximos</label>
            <input id="precision" name="precision" type="number" min="0" max="64" value={form.precision} onChange={handleChange} />
          </div>
        </>
      ) : (
        <>
          <div className="form-field">
            <label htmlFor="actualValue">Valor real p</label>
            <input id="actualValue" name="actualValue" value={form.actualValue} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="approximateValue">Aproximacion p*</label>
            <input id="approximateValue" name="approximateValue" value={form.approximateValue} onChange={handleChange} />
          </div>
        </>
      )}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Calculando...' : form.mode === 'base' ? 'Convertir' : 'Calcular errores'}
      </button>
    </form>
  );
}
