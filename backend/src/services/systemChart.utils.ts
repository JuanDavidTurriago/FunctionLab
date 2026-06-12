import type { ChartPoint } from './chart.utils.js';

export interface SystemChartBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export type ContourSegment = [ChartPoint, ChartPoint];

const round = (value: number, decimals = 8) => Number(value.toFixed(decimals));

const interpolateZero = (
  start: ChartPoint,
  end: ChartPoint,
  startValue: number,
  endValue: number,
) => {
  const denominator = startValue - endValue;
  const ratio = Math.abs(denominator) < Number.EPSILON ? 0.5 : startValue / denominator;

  return {
    x: round(start.x + ratio * (end.x - start.x)),
    y: round(start.y + ratio * (end.y - start.y)),
  };
};

const addUniquePoint = (points: ChartPoint[], point: ChartPoint, tolerance: number) => {
  const exists = points.some(
    (current) => Math.hypot(current.x - point.x, current.y - point.y) <= tolerance,
  );

  if (!exists) {
    points.push(point);
  }
};

// Construye segmentos de la curva implicita f(x,y)=0 mediante una cuadricula.
export const sampleImplicitContour = (
  evaluate: (x: number, y: number) => number,
  bounds: SystemChartBounds,
  divisions = 120,
) => {
  const safeDivisions = Math.max(20, divisions);
  const stepX = (bounds.maxX - bounds.minX) / safeDivisions;
  const stepY = (bounds.maxY - bounds.minY) / safeDivisions;
  const values = Array.from(
    { length: safeDivisions + 1 },
    () => new Float64Array(safeDivisions + 1),
  );

  for (let row = 0; row <= safeDivisions; row += 1) {
    const y = bounds.minY + row * stepY;

    for (let column = 0; column <= safeDivisions; column += 1) {
      const x = bounds.minX + column * stepX;
      const value = evaluate(x, y);
      values[row][column] = Number.isFinite(value) ? value : Number.NaN;
    }
  }

  const segments: ContourSegment[] = [];
  const duplicateTolerance = Math.min(stepX, stepY) * 1e-4;

  for (let row = 0; row < safeDivisions; row += 1) {
    for (let column = 0; column < safeDivisions; column += 1) {
      const x = bounds.minX + column * stepX;
      const y = bounds.minY + row * stepY;
      const corners: ChartPoint[] = [
        { x, y },
        { x: x + stepX, y },
        { x: x + stepX, y: y + stepY },
        { x, y: y + stepY },
      ];
      const cornerValues = [
        values[row][column],
        values[row][column + 1],
        values[row + 1][column + 1],
        values[row + 1][column],
      ];
      const edgeIndexes = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ];
      const crossings: ChartPoint[] = [];

      for (const [startIndex, endIndex] of edgeIndexes) {
        const startValue = cornerValues[startIndex];
        const endValue = cornerValues[endIndex];

        if (!Number.isFinite(startValue) || !Number.isFinite(endValue)) {
          continue;
        }

        if (startValue === 0 || endValue === 0 || startValue * endValue < 0) {
          addUniquePoint(
            crossings,
            interpolateZero(
              corners[startIndex],
              corners[endIndex],
              startValue,
              endValue,
            ),
            duplicateTolerance,
          );
        }
      }

      if (crossings.length === 2) {
        segments.push([crossings[0], crossings[1]]);
      } else if (crossings.length === 4) {
        // Una celda tipo silla contiene dos tramos independientes.
        segments.push([crossings[0], crossings[1]], [crossings[2], crossings[3]]);
      }
    }
  }

  return segments;
};

const segmentIntersection = (
  [firstStart, firstEnd]: ContourSegment,
  [secondStart, secondEnd]: ContourSegment,
) => {
  const firstDx = firstEnd.x - firstStart.x;
  const firstDy = firstEnd.y - firstStart.y;
  const secondDx = secondEnd.x - secondStart.x;
  const secondDy = secondEnd.y - secondStart.y;
  const denominator = firstDx * secondDy - firstDy * secondDx;

  if (Math.abs(denominator) < 1e-12) {
    return null;
  }

  const deltaX = secondStart.x - firstStart.x;
  const deltaY = secondStart.y - firstStart.y;
  const firstRatio = (deltaX * secondDy - deltaY * secondDx) / denominator;
  const secondRatio = (deltaX * firstDy - deltaY * firstDx) / denominator;

  if (firstRatio < 0 || firstRatio > 1 || secondRatio < 0 || secondRatio > 1) {
    return null;
  }

  return {
    x: firstStart.x + firstRatio * firstDx,
    y: firstStart.y + firstRatio * firstDy,
  };
};

export const findContourIntersections = (
  firstContour: ContourSegment[],
  secondContour: ContourSegment[],
  refine: (point: ChartPoint) => ChartPoint,
  tolerance: number,
) => {
  const intersections: ChartPoint[] = [];

  for (const firstSegment of firstContour) {
    for (const secondSegment of secondContour) {
      const candidate = segmentIntersection(firstSegment, secondSegment);

      if (candidate) {
        const refined = refine(candidate);
        addUniquePoint(intersections, { x: round(refined.x), y: round(refined.y) }, tolerance);
      }
    }
  }

  return intersections;
};

export const getSystemChartBounds = (points: ChartPoint[]): SystemChartBounds => {
  const finitePoints = points.filter(
    (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
  );
  const maximumAbsoluteCoordinate = Math.max(
    ...finitePoints.flatMap((point) => [Math.abs(point.x), Math.abs(point.y)]),
    0,
  );

  // Los ejercicios habituales cercanos al origen se muestran con ejes simetricos.
  if (maximumAbsoluteCoordinate <= 10) {
    const extent = Math.max(3, maximumAbsoluteCoordinate * 1.35 + 0.5);
    return { minX: -extent, maxX: extent, minY: -extent, maxY: extent };
  }

  const xValues = finitePoints.map((point) => point.x);
  const yValues = finitePoints.map((point) => point.y);
  const centerX = (Math.min(...xValues) + Math.max(...xValues)) / 2;
  const centerY = (Math.min(...yValues) + Math.max(...yValues)) / 2;
  const span = Math.max(
    Math.max(...xValues) - Math.min(...xValues),
    Math.max(...yValues) - Math.min(...yValues),
  );
  const halfExtent = Math.max(3, span * 0.75 + 1);

  return {
    minX: centerX - halfExtent,
    maxX: centerX + halfExtent,
    minY: centerY - halfExtent,
    maxY: centerY + halfExtent,
  };
};
