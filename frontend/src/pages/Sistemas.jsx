import { useState } from 'react';
import DataTable from '../components/common/DataTable';
import MathProcedure from '../components/common/MathProcedure';
import PageLayout from '../components/common/PageLayout';
import ResultSummary from '../components/common/ResultSummary';
import SystemIntersectionChart from '../components/charts/SystemIntersectionChart';
import SystemNewtonForm from '../components/forms/SystemNewtonForm';
import { numericalMethodsApi } from '../services/api';
import { toLatexNumber } from '../utils/mathFormat';

const systemColumns = [
  { key: 'iteration', latex: 'k' },
  { key: 'x', latex: 'x_k' },
  { key: 'y', latex: 'y_k' },
  { key: 'f1', latex: 'f_1(x_k,y_k)' },
  { key: 'f2', latex: 'f_2(x_k,y_k)' },
  { key: 'deltaX', latex: '\\Delta x_k' },
  { key: 'deltaY', latex: '\\Delta y_k' },
  { key: 'error', latex: 'e_k' },
];

export default function Sistemas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Envia las funciones y el punto inicial; la API devuelve solucion, pasos e iteraciones.
  const handleSubmit = async (payload) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await numericalMethodsApi.sistemas(payload);
      setResult(data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'No fue posible resolver el sistema.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Sistemas no lineales"
      description="Newton para sistemas 2x2 con Jacobiano simbolico desde el backend."
    >
      {error && <p className="status-error">{error}</p>}

      <div className="grid-two">
        <section className="panel">
          <h3>Entrada</h3>
          <SystemNewtonForm loading={loading} onSubmit={handleSubmit} />
        </section>

        <section className="panel">
          <h3>Resultado</h3>
          {result ? (
            <>
              <ResultSummary
                items={[
                  { label: 'Componente x', latex: `x=${toLatexNumber(result.solution.x)}` },
                  { label: 'Componente y', latex: `y=${toLatexNumber(result.solution.y)}` },
                  { label: 'Iteraciones', value: result.iterations.length },
                ]}
              />
              <MathProcedure procedure={result.procedure} />
              <DataTable columns={systemColumns} rows={result.iterations} />
            </>
          ) : (
            <p className="muted">Ejecuta el metodo para ver la solucion aproximada.</p>
          )}
        </section>
      </div>

      {result?.chart && (
        <section className="visualization-section">
          <div className="visualization-heading">
            <div>
              <h3>Interseccion de las curvas</h3>
              <p>
                Curvas f1(x,y)=0 y f2(x,y)=0, puntos de corte y trayectoria del metodo de Newton.
              </p>
            </div>
          </div>
          <SystemIntersectionChart chart={result.chart} />
        </section>
      )}
    </PageLayout>
  );
}
