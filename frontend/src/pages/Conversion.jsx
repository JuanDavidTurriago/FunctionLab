import { useState } from 'react';
import PageLayout from '../components/common/PageLayout';
import MathProcedure from '../components/common/MathProcedure';
import ResultSummary from '../components/common/ResultSummary';
import ConversionForm from '../components/forms/ConversionForm';
import { numericalMethodsApi } from '../services/api';

export default function Conversion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (payload) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await numericalMethodsApi.conversion(payload);
      setResult(data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'No fue posible convertir el numero.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Error y binarios"
      description="Conversion entre bases con fracciones y calculo de errores absoluto y relativo."
    >
      {error && <p className="status-error">{error}</p>}

      <div className="grid-two">
        <section className="panel">
          <h3>Entrada</h3>
          <ConversionForm loading={loading} onSubmit={handleSubmit} />
        </section>

        <section className="panel">
          <h3>Resultado</h3>
          {result ? (
            <>
              {result.type === 'error' ? (
                <ResultSummary
                  items={[
                    { label: 'Valor real', value: result.actualValue },
                    { label: 'Aproximacion', value: result.approximateValue },
                    { label: 'Error absoluto', value: result.absoluteError },
                    { label: 'Error relativo', value: result.relativeError },
                    { label: 'Error porcentual', value: `${Number(result.percentageError.toFixed(8))}%` },
                  ]}
                />
              ) : (
                <ResultSummary
                  items={[
                    { label: 'Original', value: `${result.originalValue} (base ${result.fromBase})` },
                    { label: 'Decimal', value: result.decimalValue },
                    { label: 'Convertido', value: `${result.convertedValue} (base ${result.toBase})` },
                  ]}
                />
              )}
              <MathProcedure procedure={result.procedure} />
            </>
          ) : (
            <p className="muted">Ejecuta una conversion o calcula errores para ver el resultado.</p>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
