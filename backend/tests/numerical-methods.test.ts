import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { parse } from 'mathjs';
import { solveBisection } from '../src/services/biseccion.service.js';
import { convertBase } from '../src/services/conversion.service.js';
import { interpolateLagrange } from '../src/services/lagrange.service.js';
import { solveNewton } from '../src/services/newton.service.js';
import { interpolateNewton } from '../src/services/newtonInterp.service.js';
import { solveSystemNewton } from '../src/services/sistemaNewton.service.js';
import { calculateTaylorSeries } from '../src/services/taylor.service.js';

const require = createRequire(import.meta.url);
const mathJaxBase = '../../frontend/node_modules/mathjax-full/js';
const { mathjax } = require(`${mathJaxBase}/mathjax.js`);
const { TeX } = require(`${mathJaxBase}/input/tex.js`);
const { AllPackages } = require(`${mathJaxBase}/input/tex/AllPackages.js`);
const { CHTML } = require(`${mathJaxBase}/output/chtml.js`);
const { liteAdaptor } = require(`${mathJaxBase}/adaptors/liteAdaptor.js`);
const { RegisterHTMLHandler } = require(`${mathJaxBase}/handlers/html.js`);
const mathJaxAdaptor = liteAdaptor();
RegisterHTMLHandler(mathJaxAdaptor);
const mathJaxDocument = mathjax.document('', {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new CHTML({ fontURL: '' }),
});

const closeTo = (actual: number, expected: number, tolerance: number, label = 'value') => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected} +/- ${tolerance}, received ${actual}`,
  );
};

const assertProcedure = (
  procedure: { formulas: string[] },
  expectedSteps?: number,
) => {
  assert.ok(procedure.formulas.length > 0);

  if (expectedSteps !== undefined) {
    assert.equal(procedure.formulas.length, expectedSteps);
  }

  for (const formula of procedure.formulas) {
    assert.ok(formula.trim().length > 0);
    assert.doesNotMatch(formula, /NaN|undefined|Infinity/);
    assert.doesNotMatch(formula, /\\\\\[/);
    assert.equal(
      (formula.match(/\\begin\{/g) ?? []).length,
      (formula.match(/\\end\{/g) ?? []).length,
      `Unbalanced LaTeX environment: ${formula}`,
    );
  }
};

const evaluate = (expression: string, x: number) => {
  return Number(parse(expression).evaluate({ x }));
};

test('Taylor: degree-four polynomial for sqrt(x) about x0=1', () => {
  const result = calculateTaylorSeries({
    functionExpression: 'sqrt(x)',
    point: 1,
    value: 1.2,
    order: 4,
  });
  const expectedPolynomial = (x: number) => (
    1
    + 0.5 * (x - 1)
    - 0.125 * (x - 1) ** 2
    + 0.0625 * (x - 1) ** 3
    - 0.0390625 * (x - 1) ** 4
  );

  closeTo(result.approximation, expectedPolynomial(1.2), 1e-8, 'Taylor approximation');
  closeTo(result.expectedValue, Math.sqrt(1.2), 1e-8, 'Exact sqrt value');
  closeTo(
    result.absoluteError,
    Math.abs(Math.sqrt(1.2) - expectedPolynomial(1.2)),
    1e-8,
    'Taylor absolute error',
  );
  assert.match(result.polynomialLatex, /0\.5 \(x-1\)/);
  assertProcedure(result.procedure, 8);

  for (const point of result.chart.functionPoints) {
    closeTo(point.y, Math.sqrt(point.x), 1e-8, 'Taylor function graph');
  }

  for (const point of result.chart.polynomialPoints) {
    closeTo(point.y, expectedPolynomial(point.x), 1e-8, 'Taylor polynomial graph');
  }

  closeTo(result.chart.expansionPoint.y, 1, 1e-12);
  closeTo(result.chart.evaluationPoint.polynomialValue, expectedPolynomial(1.2), 1e-12);
});

test('Taylor: cosine polynomial and partial sums are mathematically consistent', () => {
  const result = calculateTaylorSeries({
    functionExpression: 'cos(x)',
    point: 0,
    value: 0.5,
    order: 5,
  });
  const expected = 1 - 0.5 ** 2 / 2 + 0.5 ** 4 / 24;

  closeTo(result.approximation, expected, 1e-8);
  assert.deepEqual(result.chart.labels, ['n=0', 'n=1', 'n=2', 'n=3', 'n=4', 'n=5']);
  closeTo(result.chart.values.at(-1)!, result.approximation, 1e-8);
  assertProcedure(result.procedure, 9);
});

test('Bisection: workshop equation x=2sin(x) converges and every interval is valid', () => {
  const expression = 'x - 2*sin(x)';
  const tolerance = 1e-5;
  const result = solveBisection({
    functionExpression: expression,
    left: 1,
    right: 2,
    tolerance,
  });

  closeTo(result.root, 1.895494267033981, tolerance, 'Bisection root');
  assertProcedure(result.procedure, result.iterations.length + 3);

  result.iterations.forEach((iteration, index) => {
    closeTo(iteration.midpoint, (iteration.a + iteration.b) / 2, 1e-14, 'Midpoint');
    closeTo(iteration.fa, evaluate(expression, iteration.a), 1e-12, 'f(a)');
    closeTo(iteration.fb, evaluate(expression, iteration.b), 1e-12, 'f(b)');
    closeTo(iteration.value, evaluate(expression, iteration.midpoint), 1e-12, 'f(midpoint)');
    closeTo(iteration.error, Math.abs(iteration.b - iteration.a) / 2, 1e-14, 'Bisection error');
    assert.ok(iteration.fa * iteration.fb <= 0);

    const next = result.iterations[index + 1];
    if (next) {
      if (iteration.fa * iteration.value < 0) {
        closeTo(next.a, iteration.a, 1e-14);
        closeTo(next.b, iteration.midpoint, 1e-14);
      } else {
        closeTo(next.a, iteration.midpoint, 1e-14);
        closeTo(next.b, iteration.b, 1e-14);
      }
    }
  });

  for (const point of result.chart.functionPoints) {
    closeTo(point.y, evaluate(expression, point.x), 1e-8, 'Bisection graph');
  }
});

test('Bisection: detects roots at interval endpoints and rejects inverted intervals', () => {
  const endpoint = solveBisection({
    functionExpression: 'x^2 - 1',
    left: 1,
    right: 3,
  });

  assert.equal(endpoint.root, 1);
  assert.equal(endpoint.iterations.length, 0);
  assert.match(endpoint.procedure.formulas.at(-1)!, /f\(1\)=0/);

  assert.throws(
    () => solveBisection({ functionExpression: 'x', left: 2, right: 1 }),
    /izquierdo debe ser menor/,
  );
});

test('Newton-Raphson: workshop equation 4cos(x)=exp(x)', () => {
  const expression = '4*cos(x) - exp(x)';
  const result = solveNewton({
    functionExpression: expression,
    initialGuess: 1,
    tolerance: 1e-8,
  });

  closeTo(result.root, 0.9047882178730189, 1e-8, 'Newton root');
  assertProcedure(result.procedure, result.iterations.length + 2);

  for (const iteration of result.iterations) {
    const expectedNext = iteration.x - iteration.fx / iteration.dfx;
    closeTo(iteration.fx, evaluate(expression, iteration.x), 1e-12, 'Newton f(x)');
    closeTo(iteration.next, expectedNext, 1e-12, 'Newton update');
    closeTo(iteration.error, Math.abs(iteration.next - iteration.x), 1e-14, 'Newton error');
  }

  for (const point of result.chart.functionPoints) {
    closeTo(point.y, evaluate(expression, point.x), 1e-8, 'Newton graph');
  }
});

test('Newton for nonlinear systems: Jacobian updates solve J*delta=-F', () => {
  const result = solveSystemNewton({
    f1: 'x^2 + y^2 - 4',
    f2: 'x - y - 1',
    x0: 1.8,
    y0: 0.8,
    tolerance: 1e-10,
  });
  const expectedX = (1 + Math.sqrt(7)) / 2;
  const expectedY = (-1 + Math.sqrt(7)) / 2;

  closeTo(result.solution.x, expectedX, 1e-9, 'System x');
  closeTo(result.solution.y, expectedY, 1e-9, 'System y');
  closeTo(result.solution.x ** 2 + result.solution.y ** 2 - 4, 0, 1e-9, 'System f1');
  closeTo(result.solution.x - result.solution.y - 1, 0, 1e-9, 'System f2');
  assertProcedure(result.procedure, result.iterations.length + 3);

  let x = 1.8;
  let y = 0.8;
  for (const iteration of result.iterations) {
    const j11 = 2 * x;
    const j12 = 2 * y;
    const j21 = 1;
    const j22 = -1;

    closeTo(j11 * iteration.deltaX + j12 * iteration.deltaY, -iteration.f1, 1e-10, 'J delta row 1');
    closeTo(j21 * iteration.deltaX + j22 * iteration.deltaY, -iteration.f2, 1e-10, 'J delta row 2');
    closeTo(iteration.x, x + iteration.deltaX, 1e-12, 'System x update');
    closeTo(iteration.y, y + iteration.deltaY, 1e-12, 'System y update');

    x = iteration.x;
    y = iteration.y;
  }
});

const interpolationPoints = [
  { x: 0, y: 1 },
  { x: 1, y: 3 },
  { x: 2, y: 2 },
];
const interpolationPolynomial = (x: number) => -1.5 * x ** 2 + 3.5 * x + 1;

const assertInterpolationGraph = (
  chart: {
    inputPoints: Array<{ x: number; y: number }>;
    curvePoints: Array<{ x: number; y: number }>;
    evaluationPoint: { x: number; y: number };
  },
) => {
  assert.deepEqual(chart.inputPoints, interpolationPoints);

  for (const point of chart.inputPoints) {
    closeTo(point.y, interpolationPolynomial(point.x), 1e-12, 'Interpolation input point');
  }

  for (const point of chart.curvePoints) {
    closeTo(point.y, interpolationPolynomial(point.x), 1e-8, 'Interpolation curve');
  }

  closeTo(chart.evaluationPoint.y, interpolationPolynomial(chart.evaluationPoint.x), 1e-12);
};

test('Lagrange interpolation: polynomial passes through every input point', () => {
  const result = interpolateLagrange({
    points: interpolationPoints,
    value: 1.5,
  });

  closeTo(result.interpolatedValue, 2.875, 1e-12);
  assertInterpolationGraph(result.chart);
  assertProcedure(result.procedure, interpolationPoints.length + 3);
});

test('Newton divided differences: coefficients and curve match Lagrange', () => {
  const result = interpolateNewton({
    points: interpolationPoints,
    value: 1.5,
  });

  assert.deepEqual(result.coefficients, [1, 2, -1.5]);
  closeTo(result.interpolatedValue, 2.875, 1e-12);
  assertInterpolationGraph(result.chart);
  assertProcedure(result.procedure, 1 + 3 + 2);
});

test('Base conversion: workshop integer and fractional examples', () => {
  const integerResult = convertBase({
    mode: 'base',
    value: '10101',
    fromBase: 2,
    toBase: 10,
  });
  const fractionalResult = convertBase({
    mode: 'base',
    value: '0.11011',
    fromBase: 2,
    toBase: 10,
  });
  const reverseResult = convertBase({
    mode: 'base',
    value: '0.4375',
    fromBase: 10,
    toBase: 2,
  });

  assert.equal(integerResult.convertedValue, '21');
  closeTo(integerResult.decimalValue, 21, 0);
  assert.equal(fractionalResult.convertedValue, '0.84375');
  closeTo(fractionalResult.decimalValue, 0.84375, 1e-12);
  assert.equal(reverseResult.convertedValue, '0.0111');
  assertProcedure(integerResult.procedure, 2);
  assertProcedure(fractionalResult.procedure, 2);
  assertProcedure(reverseResult.procedure, 2);
});

test('Error theory: pi approximated by 22/7', () => {
  const result = convertBase({
    mode: 'error',
    actualValue: 'pi',
    approximateValue: '22/7',
  });
  const expectedAbsolute = Math.abs(Math.PI - 22 / 7);
  const expectedRelative = expectedAbsolute / Math.PI;

  closeTo(result.absoluteError, expectedAbsolute, 1e-15);
  closeTo(result.relativeError, expectedRelative, 1e-15);
  closeTo(result.percentageError, expectedRelative * 100, 1e-13);
  assertProcedure(result.procedure, 3);
});

test('Every generated procedure formula compiles in MathJax without errors', () => {
  const procedures = [
    calculateTaylorSeries({
      functionExpression: 'cos(x)',
      point: 0,
      value: 0.5,
      order: 5,
    }).procedure,
    solveBisection({
      functionExpression: 'x^3 - x - 2',
      left: 1,
      right: 2,
      tolerance: 1e-6,
    }).procedure,
    solveNewton({
      functionExpression: '4*cos(x) - exp(x)',
      initialGuess: 1,
      tolerance: 1e-8,
    }).procedure,
    solveSystemNewton({
      f1: 'x^2 + y^2 - 4',
      f2: 'x - y - 1',
      x0: 1.8,
      y0: 0.8,
    }).procedure,
    interpolateLagrange({
      points: interpolationPoints,
      value: 1.5,
    }).procedure,
    interpolateNewton({
      points: interpolationPoints,
      value: 1.5,
    }).procedure,
    convertBase({
      mode: 'base',
      value: '0.11011',
      fromBase: 2,
      toBase: 10,
    }).procedure,
    convertBase({
      mode: 'error',
      actualValue: 'pi',
      approximateValue: '22/7',
    }).procedure,
  ];

  for (const procedure of procedures) {
    for (const formula of procedure.formulas) {
      const node = mathJaxDocument.convert(formula, { display: true });
      const html = mathJaxAdaptor.outerHTML(node);

      assert.doesNotMatch(html, /mjx-merror|data-mjx-error|<merror/i, formula);
    }
  }
});
