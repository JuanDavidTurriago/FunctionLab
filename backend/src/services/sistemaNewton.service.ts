import { derivative, parse } from 'mathjs';
import { mathNumber, mathTuple } from './procedure.utils.js';

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
  const procedureFormulas: string[] = [
    `F(x,y)=\\begin{bmatrix}${f1Node.toTex()}\\\\${f2Node.toTex()}\\end{bmatrix}`,
    `J(x,y)=\\begin{bmatrix}${df1dx.toTex()}&${df1dy.toTex()}\\\\${df2dx.toTex()}&${df2dy.toTex()}\\end{bmatrix}`,
    `J(x_k,y_k)\\Delta_k=-F(x_k,y_k),\\qquad \\begin{bmatrix}x_{k+1}\\\\y_{k+1}\\end{bmatrix}=\\begin{bmatrix}x_k\\\\y_k\\end{bmatrix}+\\Delta_k`,
  ];

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const previousX = x;
    const previousY = y;
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
    procedureFormulas.push(
      `\\begin{aligned}J_${iteration - 1}&=\\begin{bmatrix}${mathNumber(j11)}&${mathNumber(j12)}\\\\${mathNumber(j21)}&${mathNumber(j22)}\\end{bmatrix},\\quad F_${iteration - 1}=\\begin{bmatrix}${mathNumber(value1)}\\\\${mathNumber(value2)}\\end{bmatrix}\\\\\\Delta_${iteration - 1}&=\\begin{bmatrix}${mathNumber(deltaX)}\\\\${mathNumber(deltaY)}\\end{bmatrix}\\\\(x_${iteration},y_${iteration})&=(${mathTuple([previousX, previousY])})+(${mathTuple([deltaX, deltaY])})=(${mathTuple([x, y])})\\\\e_${iteration}&=${mathNumber(error)}\\end{aligned}`,
    );

    if (error < tolerance) {
      return { solution: { x, y }, expressions, iterations, procedure: { formulas: procedureFormulas } };
    }
  }

  return { solution: { x, y }, expressions, iterations, procedure: { formulas: procedureFormulas } };
};
