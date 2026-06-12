import { useState } from 'react';
import DataTable from '../components/common/DataTable';
import MathProcedure from '../components/common/MathProcedure';
import PageLayout from '../components/common/PageLayout';
import ResultSummary from '../components/common/ResultSummary';
import RootIterationChart from '../components/charts/RootIterationChart';
import BisectionForm from '../components/forms/BisectionForm';
import NewtonForm from '../components/forms/NewtonForm';
import { numericalMethodsApi } from '../services/api';
import { toLatexNumber } from '../utils/mathFormat';

const bisectionColumns = [
  { key: 'iteration', latex: 'k' },
  { key: 'a', latex: 'a_k' },
  { key: 'b', latex: 'b_k' },
  { key: 'midpoint', latex: 'x_m' },
  { key: 'value', latex: 'f(x_m)' },
  { key: 'error', latex: 'e_k' },
];

const newtonColumns = [
  { key: 'iteration', latex: 'k' },
  { key: 'x', latex: 'x_k' },
  { key: 'fx', latex: 'f(x_k)' },
  { key: 'dfx', latex: "f'(x_k)" },
  { key: 'next', latex: 'x_{k+1}' },
  { key: 'error', latex: 'e_k' },
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
              <ResultSummary
                items={[
                  {
                    label: 'Raiz aproximada',
                    latex: `x^\\ast=${toLatexNumber(bisectionResult.root)}`,
                  },
                ]}
              />
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
              <ResultSummary
                items={[
                  {
                    label: 'Raiz aproximada',
                    latex: `x^\\ast=${toLatexNumber(newtonResult.root)}`,
                  },
                ]}
              />
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
