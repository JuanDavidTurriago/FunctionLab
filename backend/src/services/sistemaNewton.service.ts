import { derivative, parse } from 'mathjs';

interface SystemNewtonInput {
  functionExpressions?: [string, string];
  f1?: string;
  f2?: string;
  x0: number;
  y0: number;
  tolerance?: number;
  maxIterations?: number;
}

const defaultFunctions: [string, string] = ['x^2 + y^2 - 4', 'x - y - 1'];

export const solveSystemNewton = ({
  functionExpressions,
  f1,
  f2,
  x0,
  y0,
  tolerance = 1e-6,
  maxIterations = 25,
}: SystemNewtonInput) => {
  const expressions: [string, string] = [
    functionExpressions?.[0] ?? f1 ?? defaultFunctions[0],
    functionExpressions?.[1] ?? f2 ?? defaultFunctions[1],
  ];

  if (expressions.some((expression) => !expression.trim())) {
    throw new Error('Las funciones del sistema no pueden estar vacias.');
  }

  if (![x0, y0, tolerance, maxIterations].every(Number.isFinite) || maxIterations <= 0 || tolerance <= 0) {
    throw new Error('Los parametros del sistema deben ser numericos y positivos cuando aplique.');
  }

  const f1Node = parse(expressions[0]);
  const f2Node = parse(expressions[1]);
  const df1dx = derivative(f1Node, 'x');
  const df1dy = derivative(f1Node, 'y');
  const df2dx = derivative(f2Node, 'x');
  const df2dy = derivative(f2Node, 'y');

  let x = x0;
  let y = y0;
  const iterations = [];

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const scope = { x, y };
    const value1 = Number(f1Node.evaluate(scope));
    const value2 = Number(f2Node.evaluate(scope));
    const j11 = Number(df1dx.evaluate(scope));
    const j12 = Number(df1dy.evaluate(scope));
    const j21 = Number(df2dx.evaluate(scope));
    const j22 = Number(df2dy.evaluate(scope));

    if (![value1, value2, j11, j12, j21, j22].every(Number.isFinite)) {
      throw new Error('El sistema produjo un valor no numerico durante la iteracion.');
    }

    const determinant = j11 * j22 - j12 * j21;

    if (Math.abs(determinant) < Number.EPSILON) {
      throw new Error('El Jacobiano es singular en la iteracion actual.');
    }

    const deltaX = (-value1 * j22 + j12 * value2) / determinant;
    const deltaY = (value1 * j21 - j11 * value2) / determinant;

    x += deltaX;
    y += deltaY;

    const error = Math.max(Math.abs(deltaX), Math.abs(deltaY));
    iterations.push({ iteration, x, y, f1: value1, f2: value2, deltaX, deltaY, error });

    if (error < tolerance) {
      return { solution: { x, y }, expressions, iterations };
    }
  }

  return { solution: { x, y }, expressions, iterations };
};
