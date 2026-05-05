import { derivative, parse } from 'mathjs';

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

    if (error < tolerance) {
      return { root: next, iterations };
    }

    current = next;
  }

  return { root: current, iterations };
};
