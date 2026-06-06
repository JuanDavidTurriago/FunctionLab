import { buildInterpolationChart } from './interpolation.utils.js';
import { mathNumber } from './procedure.utils.js';

interface Point {
  x: number;
  y: number;
}

interface LagrangeInput {
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

export const interpolateLagrange = ({ points, value }: LagrangeInput) => {
  validateInterpolationInput(points, value);

  const evaluate = (x: number) => {
    return points.reduce((result, pointI, i) => {
      const basis = points.reduce((product, pointJ, j) => {
        return i === j ? product : product * ((x - pointJ.x) / (pointI.x - pointJ.x));
      }, 1);

      return result + pointI.y * basis;
    }, 0);
  };
  const result = evaluate(value);
  const basisFormulas = points.map((pointI, i) => {
    const numerator = points
      .map((pointJ, j) => (i === j ? null : `(x-${pointJ.x})`))
      .filter(Boolean)
      .join('');
    const denominator = points
      .map((pointJ, j) => (i === j ? null : `(${pointI.x}-${pointJ.x})`))
      .filter(Boolean)
      .join('');
    return `L_${i}(x)=\\frac{${numerator}}{${denominator}}`;
  });
  const polynomialFormula = points
    .map((point, index) => `${point.y}L_${index}(x)`)
    .join('+');

  return {
    interpolatedValue: result,
    points,
    value,
    chart: buildInterpolationChart(points, value, evaluate),
    procedure: {
      formulas: [
        `P(x)=\\sum_{i=0}^{${points.length - 1}}y_iL_i(x)`,
        ...basisFormulas,
        `P(x)=${polynomialFormula}`,
        `P(${value})=${mathNumber(result)}`,
      ],
    },
  };
};
