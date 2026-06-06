import { getPaddedDomain, sampleFunction } from './chart.utils.js';

export interface InterpolationPoint {
  x: number;
  y: number;
}

export const buildInterpolationChart = (
  points: InterpolationPoint[],
  value: number,
  evaluate: (x: number) => number,
) => {
  const domain = getPaddedDomain([...points.map((point) => point.x), value], 0.5);

  return {
    inputPoints: points,
    curvePoints: sampleFunction(evaluate, domain.start, domain.end, 161),
    evaluationPoint: { x: value, y: evaluate(value) },
  };
};
