import { useState } from 'react';
import DataTable from '../components/common/DataTable';
import MathProcedure from '../components/common/MathProcedure';
import PageLayout from '../components/common/PageLayout';
import ResultSummary from '../components/common/ResultSummary';
import RootIterationChart from '../components/charts/RootIterationChart';
import BisectionForm from '../components/forms/BisectionForm';
import NewtonForm from '../components/forms/NewtonForm';
import { numericalMethodsApi } from '../services/api';

const bisectionColumns = [
  { key: 'iteration', label: 'i' },
  { key: 'a', label: 'a' },
  { key: 'b', label: 'b' },
  { key: 'midpoint', label: 'xm' },
  { key: 'value', label: 'f(xm)' },
  { key: 'error', label: 'error' },
];

const newtonColumns = [
  { key: 'iteration', label: 'i' },
  { key: 'x', label: 'x' },
  { key: 'fx', label: 'f(x)' },
  { key: 'dfx', label: "f'(x)" },
  { key: 'next', label: 'x siguiente' },
  { key: 'error', label: 'error' },
];

export default function Ecuaciones() {
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [bisectionResult, setBisectionResult] = useState(null);
  const [newtonResult, setNewtonResult] = useState(null);

  // Ambos metodos comparten manejo de carga y errores, pero mantienen resultados independientes.
  const runRequest = async (method, request) => {
    try {
      setLoading(method);
      setError('');
      const { data } = await request();

      // Se actualiza solo el panel que inicio la peticion.
      if (method === 'bisection') {
        setBisectionResult(data.data);
      } else {
        setNewtonResult(data.data);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? requestError.message ?? 'No fue posible completar el calculo.');
    } finally {
      setLoading('');
    }
  };

  return (
    <PageLayout
      title="Metodos para ecuaciones"
      description="Biseccion y Newton conectados al backend con tabla de iteraciones."
    >
      {error && <p className="status-error">{error}</p>}

      <div className="grid-two">
        <section className="panel">
          <h3>Biseccion</h3>
          <BisectionForm
            loading={loading === 'bisection'}
            onSubmit={(payload) => runRequest('bisection', () => numericalMethodsApi.biseccion(payload))}
          />
          {bisectionResult && (
            <>
              <ResultSummary items={[{ label: 'Raiz aproximada', value: bisectionResult.root }]} />
              <MathProcedure procedure={bisectionResult.procedure} />
              <h4>Construccion grafica</h4>
              <RootIterationChart method="bisection" result={bisectionResult} />
              <DataTable columns={bisectionColumns} rows={bisectionResult.iterations} />
            </>
          )}
        </section>

        <section className="panel">
          <h3>Newton</h3>
          <NewtonForm
            loading={loading === 'newton'}
            onSubmit={(payload) => runRequest('newton', () => numericalMethodsApi.newton(payload))}
          />
          {newtonResult && (
            <>
              <ResultSummary items={[{ label: 'Raiz aproximada', value: newtonResult.root }]} />
              <MathProcedure procedure={newtonResult.procedure} />
              <h4>Construccion grafica</h4>
              <RootIterationChart method="newton" result={newtonResult} />
              <DataTable columns={newtonColumns} rows={newtonResult.iterations} />
            </>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
