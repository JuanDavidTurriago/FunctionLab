import { useState } from 'react';
import PageLayout from '../components/common/PageLayout';
import MathProcedure from '../components/common/MathProcedure';
import ResultSummary from '../components/common/ResultSummary';
import InterpolationForm from '../components/forms/InterpolationForm';
import InterpolationChart from '../components/charts/InterpolationChart';
import { numericalMethodsApi } from '../services/api';

export default function Interpolacion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [method, setMethod] = useState('lagrange');

  // El mismo formulario selecciona el endpoint de Lagrange o diferencias divididas.
  const handleSubmit = async (selectedMethod, payload) => {
    try {
      setLoading(true);
      setError('');
      setMethod(selectedMethod);
      // Ambos endpoints conservan el mismo contrato de respuesta para reutilizar la vista.
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
              <MathProcedure procedure={result.procedure} />
            </>
          ) : (
            <p className="muted">Ingresa puntos para calcular el valor interpolado.</p>
          )}
        </section>
      </div>

      {result?.chart && (
        <section className="visualization-section">
          <div className="visualization-heading">
            <div>
              <h3>Ajuste de la curva</h3>
              <p>Polinomio interpolante, puntos conocidos y valor calculado.</p>
            </div>
          </div>
          <InterpolationChart chart={result.chart} />
        </section>
      )}
    </PageLayout>
  );
}
