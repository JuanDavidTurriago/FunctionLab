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

  let result = 0;

  points.forEach((pointI, i) => {
    let basis = 1;

    points.forEach((pointJ, j) => {
      if (i !== j) {
        basis *= (value - pointJ.x) / (pointI.x - pointJ.x);
      }
    });

    result += pointI.y * basis;
  });

  return { interpolatedValue: result, points, value };
};
