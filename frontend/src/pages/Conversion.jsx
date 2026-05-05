import { useState } from 'react';
import PageLayout from '../components/common/PageLayout';
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
      title="Conversion de bases"
      description="Conversion de enteros entre bases 2 y 36 con validacion de digitos."
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
            <ResultSummary
              items={[
                { label: 'Original', value: `${result.originalValue} (base ${result.fromBase})` },
                { label: 'Decimal', value: result.decimalValue },
                { label: 'Convertido', value: `${result.convertedValue} (base ${result.toBase})` },
              ]}
            />
          ) : (
            <p className="muted">Ejecuta una conversion para ver el resultado.</p>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
