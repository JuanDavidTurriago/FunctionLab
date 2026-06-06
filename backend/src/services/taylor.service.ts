import { derivative, factorial, parse } from 'mathjs';
import { getPaddedDomain, sampleFunction } from './chart.utils.js';
import { mathNumber } from './procedure.utils.js';

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
  // Se valida antes de pasar expresiones a mathjs para producir errores claros.
  if (!functionExpression?.trim()) {
    throw new Error('La funcion no puede estar vacia.');
  }

  if (!Number.isFinite(point) || !Number.isFinite(value) || !Number.isInteger(order) || order < 0) {
    throw new Error('Los parametros point, value y order deben ser numericos validos.');
  }

  const partialApproximations: number[] = [];
  const coefficients: number[] = [];
  const terms: string[] = [];
  const procedureFormulas: string[] = [
    `P_{${order}}(x)=\\sum_{k=0}^{${order}}\\frac{f^{(k)}(${point})}{k!}(x-${point})^k`,
  ];
  let approximation = 0;
  let currentDerivative = parse(functionExpression);

  // En cada vuelta se evalua f^(n)(a), se calcula f^(n)(a)/n! y se
  // acumula el termino correspondiente tanto simbolica como numericamente.
  for (let n = 0; n <= order; n += 1) {
    const derivativeAtPoint = Number(currentDerivative.evaluate({ x: point }));
    assertFinite(derivativeAtPoint, `La derivada de orden ${n}`);

    const coefficient = derivativeAtPoint / Number(factorial(n));
    coefficients.push(coefficient);
    procedureFormulas.push(
      `\\frac{f^{(${n})}(${point})}{${n}!}=\\frac{${mathNumber(derivativeAtPoint)}}{${Number(factorial(n))}}=${mathNumber(coefficient)}`,
    );
    const power = n === 0 ? '' : n === 1 ? `(x - ${point})` : `(x - ${point})^${n}`;

    terms.push(`${toRounded(coefficient)}${power ? ` ${power}` : ''}`.trim());
    approximation += coefficient * (value - point) ** n;
    partialApproximations.push(toRounded(approximation));

    // mathjs deriva el nodo actual; asi se obtiene la derivada de orden n+1.
    currentDerivative = derivative(currentDerivative, 'x');
  }

  // El valor real solo se usa para medir el error de la aproximacion.
  const expectedValue = evaluateExpression(functionExpression, value);
  assertFinite(expectedValue, 'El valor esperado');
  const domain = getPaddedDomain([point, value], 1);
  const evaluatePolynomial = (x: number) => {
    // Esta evaluacion usa los coeficientes ya calculados y alimenta la grafica.
    return coefficients.reduce((total, coefficient, index) => {
      return total + coefficient * (x - point) ** index;
    }, 0);
  };

  // Se transforma la representacion legible a una expresion compatible con LaTeX.
  const polynomialLatex = terms
    .map((term, index) => {
      const sanitized = term
        .replace(/\(x - ([^)]+)\)\^(\d+)/g, '(x-$1)^{$2}')
        .replace(/\(x - ([^)]+)\)/g, '(x-$1)');
      return index === 0 ? sanitized : `+ ${sanitized}`;
    })
    .join(' ')
    .replace(/\+\s-/g, '- ');
  procedureFormulas.push(`P_{${order}}(x)=${polynomialLatex}`);
  procedureFormulas.push(
    `P_{${order}}(${value})=${mathNumber(approximation)},\\qquad f(${value})=${mathNumber(expectedValue)},\\qquad |E|=${mathNumber(Math.abs(expectedValue - approximation))}`,
  );

  return {
    input: { functionExpression, point, value, order },
    polynomial: terms.join(' + ').replace(/\+\s-\s/g, '- '),
    polynomialLatex,
    approximation: toRounded(approximation),
    expectedValue: toRounded(expectedValue),
    absoluteError: toRounded(Math.abs(expectedValue - approximation)),
    chart: {
      // Se entregan datos, no componentes visuales: Chart.js vive en el frontend.
      labels: partialApproximations.map((_, index) => `n=${index}`),
      values: partialApproximations,
      functionPoints: sampleFunction((x) => evaluateExpression(functionExpression, x), domain.start, domain.end),
      polynomialPoints: sampleFunction(evaluatePolynomial, domain.start, domain.end),
      expansionPoint: { x: point, y: evaluateExpression(functionExpression, point) },
      evaluationPoint: {
        x: value,
        functionValue: expectedValue,
        polynomialValue: approximation,
      },
    },
    // Las formulas se generan con los valores reales usados en este calculo.
    procedure: { formulas: procedureFormulas },
  };
};
