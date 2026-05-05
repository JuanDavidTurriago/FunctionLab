import { useState } from 'react';
import PageLayout from '../components/common/PageLayout';
import ResultSummary from '../components/common/ResultSummary';
import InterpolationForm from '../components/forms/InterpolationForm';
import { numericalMethodsApi } from '../services/api';

export default function Interpolacion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [method, setMethod] = useState('lagrange');

  const handleSubmit = async (selectedMethod, payload) => {
    try {
      setLoading(true);
      setError('');
      setMethod(selectedMethod);
      const request =
        selectedMethod === 'lagrange'
          ? numericalMethodsApi.lagrange(payload)
          : numericalMethodsApi.newtonInterpolacion(payload);
      const { data } = await request;
      setResult(data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? requestError.message ?? 'No fue posible interpolar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Interpolacion"
      description="Lagrange y Newton interpolante conectados a la API."
    >
      {error && <p className="status-error">{error}</p>}

      <div className="grid-two">
        <section className="panel">
          <h3>Datos</h3>
          <InterpolationForm loading={loading} onSubmit={handleSubmit} />
        </section>

        <section className="panel">
          <h3>Resultado</h3>
          {result ? (
            <>
              <ResultSummary
                items={[
                  { label: 'Metodo', value: method === 'lagrange' ? 'Lagrange' : 'Newton' },
                  { label: 'x evaluado', value: result.value },
                  { label: 'Valor interpolado', value: result.interpolatedValue },
                ]}
              />
              {result.coefficients && (
                <div className="result-block">
                  Coeficientes: {result.coefficients.map((coefficient) => Number(coefficient.toFixed(8))).join(', ')}
                </div>
              )}
            </>
          ) : (
            <p className="muted">Ingresa puntos para calcular el valor interpolado.</p>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
