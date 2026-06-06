const formatValue = (value) => {
  if (typeof value === 'number') {
    // Se limita el ruido decimal sin alterar enteros ni los datos originales.
    return Number.isInteger(value) ? value : Number(value.toFixed(8));
  }

  return value ?? '-';
};

export default function DataTable({ columns, rows = [] }) {
  if (!rows.length) {
    return <p className="muted">Sin iteraciones para mostrar.</p>;
  }

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Las columnas describen que propiedad leer de cada registro de iteracion. */}
          {rows.map((row, rowIndex) => (
            <tr key={`${row.iteration ?? rowIndex}-${rowIndex}`}>
              {columns.map((column) => (
                <td key={column.key}>{formatValue(row[column.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
