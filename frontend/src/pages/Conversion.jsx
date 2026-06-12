import { useState } from 'react';
import PageLayout from '../components/common/PageLayout';
import MathProcedure from '../components/common/MathProcedure';
import ResultSummary from '../components/common/ResultSummary';
import ConversionForm from '../components/forms/ConversionForm';
import { numericalMethodsApi } from '../services/api';
import { toLatexBaseValue, toLatexNumber } from '../utils/mathFormat';

export default function Conversion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // El tipo devuelto permite presentar conversiones y errores en el mismo modulo.
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
                    { label: 'Valor real', latex: `p=${toLatexNumber(result.actualValue)}` },
                    { label: 'Aproximacion', latex: `p^\\ast=${toLatexNumber(result.approximateValue)}` },
                    { label: 'Error absoluto', latex: `E_a=${toLatexNumber(result.absoluteError)}` },
                    { label: 'Error relativo', latex: `E_r=${toLatexNumber(result.relativeError)}` },
                    {
                      label: 'Error porcentual',
                      latex: `E_{\\%}=${toLatexNumber(result.percentageError)}\\%`,
                    },
                  ]}
                />
              ) : (
                <ResultSummary
                  items={[
                    {
                      label: 'Original',
                      latex: toLatexBaseValue(result.originalValue, result.fromBase),
                    },
                    { label: 'Decimal', latex: `x_{10}=${toLatexNumber(result.decimalValue)}` },
                    {
                      label: 'Convertido',
                      latex: toLatexBaseValue(result.convertedValue, result.toBase),
                    },
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
