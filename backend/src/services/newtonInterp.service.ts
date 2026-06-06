import { buildInterpolationChart } from './interpolation.utils.js';
import { mathNumber } from './procedure.utils.js';

interface Point {
  x: number;
  y: number;
}

interface NewtonInterpolationInput {
  points: Point[];
  value: number;
}

const validateInterpolationInput = (points: Point[], value: number) => {
  if (!Array.isArray(points) || points.length === 0) {
    throw new Error('Debes proporcionar al menos un punto para interpolar.');
  }

  if (!Number.isFinite(value) || points.some((point) => !Number.isFinite(point.x) || !Number.isFinite(point.y))) {
    throw new Error('Los puntos y el valor de interpolacion deben ser numericos.');
  }

  const uniqueXValues = new Set(points.map((point) => point.x));
  if (uniqueXValues.size !== points.length) {
    throw new Error('Los valores de x no pueden repetirse.');
  }
};

export const interpolateNewton = ({ points, value }: NewtonInterpolationInput) => {
  validateInterpolationInput(points, value);

  const coefficients = points.map((point) => point.y);
  const dividedDifferenceFormulas: string[] = [];

  for (let j = 1; j < points.length; j += 1) {
    for (let i = points.length - 1; i >= j; i -= 1) {
      const upperValue = coefficients[i];
      const lowerValue = coefficients[i - 1];
      coefficients[i] = (upperValue - lowerValue) / (points[i].x - points[i - j].x);
      dividedDifferenceFormulas.push(
        `f[x_${i - j},\\ldots,x_${i}]=\\frac{${mathNumber(upperValue)}-${mathNumber(lowerValue)}}{${points[i].x}-${points[i - j].x}}=${mathNumber(coefficients[i])}`,
      );
    }
  }

  const evaluate = (x: number) => {
    let result = coefficients[points.length - 1];

    for (let i = points.length - 2; i >= 0; i -= 1) {
      result = result * (x - points[i].x) + coefficients[i];
    }

    return result;
  };
  const result = evaluate(value);
  const polynomialFormula = coefficients
    .map((coefficient, index) => {
      const factors = points
        .slice(0, index)
        .map((point) => `(x-${point.x})`)
        .join('');
      return `${mathNumber(coefficient)}${factors}`;
    })
    .join('+');

  return {
    interpolatedValue: result,
    coefficients,
    points,
    value,
    chart: buildInterpolationChart(points, value, evaluate),
    procedure: {
      formulas: [
        `P_n(x)=f[x_0]+\\sum_{k=1}^{n}f[x_0,\\ldots,x_k]\\prod_{j=0}^{k-1}(x-x_j)`,
        ...dividedDifferenceFormulas,
        `P_${points.length - 1}(x)=${polynomialFormula}`,
        `P_${points.length - 1}(${value})=${mathNumber(result)}`,
      ],
    },
  };
};
