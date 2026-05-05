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

  for (let j = 1; j < points.length; j += 1) {
    for (let i = points.length - 1; i >= j; i -= 1) {
      coefficients[i] = (coefficients[i] - coefficients[i - 1]) / (points[i].x - points[i - j].x);
    }
  }

  let result = coefficients[points.length - 1];

  for (let i = points.length - 2; i >= 0; i -= 1) {
    result = result * (value - points[i].x) + coefficients[i];
  }

  return { interpolatedValue: result, coefficients, points, value };
};
