import { useState } from 'react';
import DataTable from '../components/common/DataTable';
import MathProcedure from '../components/common/MathProcedure';
import PageLayout from '../components/common/PageLayout';
import ResultSummary from '../components/common/ResultSummary';
import SystemNewtonForm from '../components/forms/SystemNewtonForm';
import { numericalMethodsApi } from '../services/api';

const systemColumns = [
  { key: 'iteration', label: 'i' },
  { key: 'x', label: 'x' },
  { key: 'y', label: 'y' },
  { key: 'f1', label: 'f1' },
  { key: 'f2', label: 'f2' },
  { key: 'deltaX', label: 'dx' },
  { key: 'deltaY', label: 'dy' },
  { key: 'error', label: 'error' },
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
                  { label: 'x', value: result.solution.x },
                  { label: 'y', value: result.solution.y },
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
    </PageLayout>
  );
}
