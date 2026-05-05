import { parse } from 'mathjs';

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
  if (!functionExpression?.trim()) {
    throw new Error('La funcion no puede estar vacia.');
  }

  if (![left, right, tolerance, maxIterations].every(Number.isFinite) || maxIterations <= 0 || tolerance <= 0) {
    throw new Error('Los parametros de biseccion deben ser numericos y positivos cuando aplique.');
  }

  const compiled = parse(functionExpression);
  const evaluate = (x: number) => Number(compiled.evaluate({ x }));

  let a = left;
  let b = right;
  let fa = evaluate(a);
  let fb = evaluate(b);

  if (![fa, fb].every(Number.isFinite)) {
    throw new Error('La funcion produjo un valor no numerico en el intervalo inicial.');
  }

  if (fa * fb > 0) {
    throw new Error('El intervalo inicial no contiene un cambio de signo.');
  }

  const iterations = [];

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const midpoint = (a + b) / 2;
    const fm = evaluate(midpoint);
    const error = Math.abs(b - a) / 2;

    if (![fa, fb, fm].every(Number.isFinite)) {
      throw new Error('La funcion produjo un valor no numerico durante la iteracion.');
    }

    iterations.push({ iteration, a, b, midpoint, value: fm, error });

    if (Math.abs(fm) < tolerance || error < tolerance) {
      return { root: midpoint, iterations };
    }

    if (fa * fm < 0) {
      b = midpoint;
      fb = fm;
    } else {
      a = midpoint;
      fa = fm;
    }
  }

  return { root: (a + b) / 2, iterations };
};
