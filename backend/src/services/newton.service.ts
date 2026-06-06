import { derivative, parse } from 'mathjs';
import { getPaddedDomain, sampleFunction } from './chart.utils.js';
import { mathNumber } from './procedure.utils.js';

interface NewtonInput {
  functionExpression: string;
  initialGuess: number;
  tolerance?: number;
  maxIterations?: number;
}

export const solveNewton = ({
  functionExpression,
  initialGuess,
  tolerance = 1e-6,
  maxIterations = 50,
}: NewtonInput) => {
  if (!functionExpression?.trim()) {
    throw new Error('La funcion no puede estar vacia.');
  }

  if (![initialGuess, tolerance, maxIterations].every(Number.isFinite) || maxIterations <= 0 || tolerance <= 0) {
    throw new Error('Los parametros de Newton deben ser numericos y positivos cuando aplique.');
  }

  const fx = parse(functionExpression);
  const dfx = derivative(fx, 'x');

  let current = initialGuess;
  const iterations = [];
  const procedureFormulas: string[] = [
    `f(x)=${fx.toTex()},\\qquad f'(x)=${dfx.toTex()}`,
    `x_{k+1}=x_k-\\frac{f(x_k)}{f'(x_k)}`,
  ];

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const value = Number(fx.evaluate({ x: current }));
    const slope = Number(dfx.evaluate({ x: current }));

    if (![value, slope].every(Number.isFinite)) {
      throw new Error('La funcion produjo un valor no numerico durante la iteracion.');
    }

    if (slope === 0) {
      throw new Error('La derivada se anulo durante la iteracion de Newton.');
    }

    const next = current - value / slope;
    const error = Math.abs(next - current);

    iterations.push({ iteration, x: current, fx: value, dfx: slope, next, error });
    procedureFormulas.push(
      `\\begin{aligned}x_${iteration}&=${mathNumber(current)}-\\frac{${mathNumber(value)}}{${mathNumber(slope)}}=${mathNumber(next)}\\\\e_${iteration}&=|${mathNumber(next)}-${mathNumber(current)}|=${mathNumber(error)}\\end{aligned}`,
    );

    if (error < tolerance) {
      const domain = getPaddedDomain(
        [initialGuess, next, ...iterations.flatMap((item) => [item.x, item.next])],
        1,
      );

      return {
        root: next,
        iterations,
        chart: {
          functionPoints: sampleFunction((x) => Number(fx.evaluate({ x })), domain.start, domain.end),
        },
        procedure: { formulas: procedureFormulas },
      };
    }

    current = next;
  }

  const domain = getPaddedDomain(
    [initialGuess, current, ...iterations.flatMap((item) => [item.x, item.next])],
    1,
  );

  return {
    root: current,
    iterations,
    chart: {
      functionPoints: sampleFunction((x) => Number(fx.evaluate({ x })), domain.start, domain.end),
    },
    procedure: { formulas: procedureFormulas },
  };
};
