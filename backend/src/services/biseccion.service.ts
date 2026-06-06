import { parse } from 'mathjs';
import { sampleFunction } from './chart.utils.js';
import { mathNumber } from './procedure.utils.js';

interface BisectionInput {
  functionExpression: string;
  left: number;
  right: number;
  tolerance?: number;
  maxIterations?: number;
}

export const solveBisection = ({
  functionExpression,
  left,
  right,
  tolerance = 1e-6,
  maxIterations = 100,
}: BisectionInput) => {
  // Biseccion requiere un intervalo ordenado y una tolerancia positiva.
  if (!functionExpression?.trim()) {
    throw new Error('La funcion no puede estar vacia.');
  }

  if (
    ![left, right, tolerance, maxIterations].every(Number.isFinite)
    || !Number.isInteger(maxIterations)
    || maxIterations <= 0
    || tolerance <= 0
  ) {
    throw new Error('Los parametros de biseccion deben ser numericos y positivos cuando aplique.');
  }

  if (left >= right) {
    throw new Error('El extremo izquierdo debe ser menor que el extremo derecho.');
  }

  const compiled = parse(functionExpression);
  // La expresion se compila una sola vez y se reutiliza en todas las iteraciones.
  const evaluate = (x: number) => Number(compiled.evaluate({ x }));

  let a = left;
  let b = right;
  const initialLeft = left;
  const initialRight = right;
  let fa = evaluate(a);
  let fb = evaluate(b);

  if (![fa, fb].every(Number.isFinite)) {
    throw new Error('La funcion produjo un valor no numerico en el intervalo inicial.');
  }

  const procedureFormulas: string[] = [
    `f(x)=${compiled.toTex()}`,
    `a_0=${mathNumber(left)},\\quad b_0=${mathNumber(right)},\\quad f(a_0)f(b_0)=${mathNumber(fa * fb)}\\leq 0`,
    `x_m^{(k)}=\\frac{a_{k-1}+b_{k-1}}{2}`,
  ];
  const iterationRecords: Array<{
    iteration: number;
    a: number;
    b: number;
    fa: number;
    fb: number;
    midpoint: number;
    value: number;
    error: number;
  }> = [];
  const buildResult = (root: number, iterations: typeof iterationRecords) => ({
    root,
    iterations,
    chart: {
      functionPoints: sampleFunction(evaluate, initialLeft, initialRight),
    },
    procedure: { formulas: procedureFormulas },
  });

  // Una raiz exacta en un extremo evita ejecutar iteraciones innecesarias.
  if (fa === 0) {
    procedureFormulas.push(`f(${mathNumber(a)})=0\\Rightarrow p=${mathNumber(a)}`);
    return buildResult(a, iterationRecords);
  }

  if (fb === 0) {
    procedureFormulas.push(`f(${mathNumber(b)})=0\\Rightarrow p=${mathNumber(b)}`);
    return buildResult(b, iterationRecords);
  }

  if (fa * fb > 0) {
    throw new Error('El intervalo inicial no contiene un cambio de signo.');
  }

  // Cada iteracion conserva la mitad donde sigue existiendo cambio de signo.
  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const midpoint = (a + b) / 2;
    const fm = evaluate(midpoint);
    const error = Math.abs(b - a) / 2;

    if (![fa, fb, fm].every(Number.isFinite)) {
      throw new Error('La funcion produjo un valor no numerico durante la iteracion.');
    }

    iterationRecords.push({ iteration, a, b, fa, fb, midpoint, value: fm, error });
    const nextA = fa * fm < 0 ? a : midpoint;
    const nextB = fa * fm < 0 ? midpoint : b;
    procedureFormulas.push(
      `\\begin{aligned}x_m^{(${iteration})}&=\\frac{${mathNumber(a)}+${mathNumber(b)}}{2}=${mathNumber(midpoint)}\\\\f(a)f(x_m)&=${mathNumber(fa)}\\cdot${mathNumber(fm)}=${mathNumber(fa * fm)}\\\\\\left[a_${iteration},b_${iteration}\\right]&=\\left[${mathNumber(nextA)},${mathNumber(nextB)}\\right]\\\\e_${iteration}&=\\frac{|${mathNumber(b)}-${mathNumber(a)}|}{2}=${mathNumber(error)}\\end{aligned}`,
    );

    if (Math.abs(fm) < tolerance || error < tolerance) {
      return buildResult(midpoint, iterationRecords);
    }

    // El producto negativo identifica la mitad que contiene al menos una raiz.
    if (fa * fm < 0) {
      b = midpoint;
      fb = fm;
    } else {
      a = midpoint;
      fa = fm;
    }
  }

  return buildResult((a + b) / 2, iterationRecords);
};
