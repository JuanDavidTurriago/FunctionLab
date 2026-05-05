import { derivative, factorial, parse } from 'mathjs';

export interface TaylorInput {
  functionExpression: string;
  point: number;
  value: number;
  order: number;
}

const evaluateExpression = (expression: string, x: number) => {
  return Number(parse(expression).evaluate({ x }));
};

const toRounded = (value: number, decimals = 8) => Number(value.toFixed(decimals));

const assertFinite = (value: number, fieldName: string) => {
  if (!Number.isFinite(value)) {
    throw new Error(`${fieldName} debe ser un numero finito.`);
  }
};

export const calculateTaylorSeries = ({ functionExpression, point, value, order }: TaylorInput) => {
  if (!functionExpression?.trim()) {
    throw new Error('La funcion no puede estar vacia.');
  }

  if (!Number.isFinite(point) || !Number.isFinite(value) || !Number.isInteger(order) || order < 0) {
    throw new Error('Los parametros point, value y order deben ser numericos validos.');
  }

  const partialApproximations: number[] = [];
  const terms: string[] = [];
  let approximation = 0;
  let currentDerivative = parse(functionExpression);

  for (let n = 0; n <= order; n += 1) {
    const derivativeAtPoint = Number(currentDerivative.evaluate({ x: point }));
    assertFinite(derivativeAtPoint, `La derivada de orden ${n}`);

    const coefficient = derivativeAtPoint / Number(factorial(n));
    const power = n === 0 ? '' : n === 1 ? `(x - ${point})` : `(x - ${point})^${n}`;

    terms.push(`${toRounded(coefficient)}${power ? ` ${power}` : ''}`.trim());
    approximation += coefficient * (value - point) ** n;
    partialApproximations.push(toRounded(approximation));
    currentDerivative = derivative(currentDerivative, 'x');
  }

  const expectedValue = evaluateExpression(functionExpression, value);
  assertFinite(expectedValue, 'El valor esperado');

  return {
    input: { functionExpression, point, value, order },
    polynomial: terms.join(' + ').replace(/\+\s-\s/g, '- '),
    polynomialLatex: terms
      .map((term, index) => {
        const sanitized = term
          .replace(/\(x - ([^)]+)\)\^(\d+)/g, '(x-$1)^{$2}')
          .replace(/\(x - ([^)]+)\)/g, '(x-$1)');
        return index === 0 ? sanitized : `+ ${sanitized}`;
      })
      .join(' ')
      .replace(/\+\s-/g, '- '),
    approximation: toRounded(approximation),
    expectedValue: toRounded(expectedValue),
    absoluteError: toRounded(Math.abs(expectedValue - approximation)),
    chart: {
      labels: partialApproximations.map((_, index) => `n=${index}`),
      values: partialApproximations,
    },
  };
};
