export interface ChartPoint {
  x: number;
  y: number;
}

const round = (value: number, decimals = 10) => Number(value.toFixed(decimals));

export const sampleFunction = (
  evaluate: (x: number) => number,
  start: number,
  end: number,
  samples = 121,
) => {
  const safeSamples = Math.max(samples, 2);
  const step = (end - start) / (safeSamples - 1);
  const points: ChartPoint[] = [];

  for (let index = 0; index < safeSamples; index += 1) {
    const x = start + step * index;
    const y = evaluate(x);

    if (Number.isFinite(y)) {
      points.push({ x: round(x), y: round(y) });
    }
  }

  return points;
};

export const getPaddedDomain = (values: number[], minimumPadding = 1) => {
  const finiteValues = values.filter(Number.isFinite);
  const minimum = Math.min(...finiteValues);
  const maximum = Math.max(...finiteValues);
  const span = maximum - minimum;
  const padding = Math.max(span * 0.2, minimumPadding);

  return {
    start: minimum - padding,
    end: maximum + padding,
  };
};
