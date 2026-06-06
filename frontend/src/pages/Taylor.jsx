import { useState } from 'react';
import { MathJax } from 'better-react-mathjax';
import PageLayout from '../components/common/PageLayout';
import MathProcedure from '../components/common/MathProcedure';
import TaylorForm from '../components/forms/TaylorForm';
import LineChart from '../components/charts/LineChart';
import TaylorComparisonChart from '../components/charts/TaylorComparisonChart';
import { numericalMethodsApi } from '../services/api';

export default function Taylor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // La pagina coordina la peticion y conserva el resultado; el calculo vive en el backend.
  const handleSubmit = async (payload) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await numericalMethodsApi.taylor(payload);
      setResult(data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'No fue posible calcular la serie de Taylor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Serie de Taylor"
      description="Aproximacion por polinomio de Taylor con validacion contra el valor real."
    >
      <div className="grid-two">
        <div className="panel">
          <TaylorForm onSubmit={handleSubmit} loading={loading} />
          {error && <p className="status-error">{error}</p>}
          {!error && result && <p className="status-success">Calculo realizado correctamente.</p>}
        </div>

        <div className="panel">
          {result ? (
            <>
              <h3>Resultado</h3>
              <p>
                <strong>Polinomio:</strong>
              </p>
              <MathJax key={result.polynomialLatex} dynamic>
                {`\\(${result.polynomialLatex}\\)`}
              </MathJax>
              <div className="result-block">
                Aproximacion: {result.approximation}
                {'\n'}
                Valor esperado: {result.expectedValue}
                {'\n'}
                Error absoluto: {result.absoluteError}
              </div>
              <MathProcedure procedure={result.procedure} />
            </>
          ) : (
            <p className="muted">Envia el formulario para ver la aproximacion y el polinomio generado.</p>
          )}
        </div>
      </div>

      {result?.chart && (
        <>
          {/* Las graficas solo se montan cuando la API entrega puntos validos. */}
          <section className="visualization-section">
            <div className="visualization-heading">
              <div>
                <h3>Funcion y polinomio</h3>
                <p>Comparacion de la funcion original con su aproximacion de Taylor.</p>
              </div>
            </div>
            <TaylorComparisonChart chart={result.chart} />
          </section>

          <section className="visualization-section">
            <div className="visualization-heading">
              <div>
                <h3>Convergencia por termino</h3>
                <p>Valor acumulado al agregar cada termino del polinomio.</p>
              </div>
            </div>
            <div className="chart-frame chart-frame-small">
              <LineChart
                labels={result.chart.labels}
                values={result.chart.values}
                label="Aproximacion parcial"
              />
            </div>
          </section>
        </>
      )}
    </PageLayout>
  );
}
