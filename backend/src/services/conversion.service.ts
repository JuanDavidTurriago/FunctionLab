import { parse } from 'mathjs';
import { mathNumber } from './procedure.utils.js';

interface BaseConversionInput {
  mode?: 'base';
  value: string;
  fromBase: number;
  toBase: number;
  precision?: number;
}

interface ErrorInput {
  mode: 'error';
  actualValue: string | number;
  approximateValue: string | number;
}

type ConversionInput = BaseConversionInput | ErrorInput;

const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const evaluateNumericExpression = (value: string | number) => {
  const numericValue = typeof value === 'number' ? value : Number(parse(String(value)).evaluate());

  if (!Number.isFinite(numericValue)) {
    throw new Error('La expresion numerica no es valida.');
  }

  return numericValue;
};

const isValidForBase = (value: string, base: number) => {
  return [...value].every((digit) => {
    if (digit === '.') {
      return true;
    }

    const digitValue = digits.indexOf(digit);
    return digitValue >= 0 && digitValue < base;
  });
};

const fromBaseToDecimal = (value: string, base: number) => {
  const sign = value.startsWith('-') ? -1 : 1;
  const unsignedValue = value.replace(/^-/, '');
  const [integerPart = '0', fractionalPart = ''] = unsignedValue.split('.');

  // La parte entera usa Horner; la fraccion suma digito * base^(-posicion).
  const integerValue = [...integerPart].reduce((total, digit) => total * base + digits.indexOf(digit), 0);
  const fractionalValue = [...fractionalPart].reduce((total, digit, index) => {
    return total + digits.indexOf(digit) / base ** (index + 1);
  }, 0);

  return sign * (integerValue + fractionalValue);
};

const fromDecimalToBase = (decimalValue: number, base: number, precision: number) => {
  const sign = decimalValue < 0 ? '-' : '';
  let remainingInteger = Math.trunc(Math.abs(decimalValue));
  let remainingFraction = Math.abs(decimalValue) - remainingInteger;

  const integerPart = remainingInteger.toString(base).toUpperCase();
  const fractionalDigits: string[] = [];

  // Multiplicar repetidamente la fraccion por la base produce sus digitos.
  while (remainingFraction > Number.EPSILON && fractionalDigits.length < precision) {
    remainingFraction *= base;
    const digitValue = Math.floor(remainingFraction);
    fractionalDigits.push(digits[digitValue]);
    remainingFraction -= digitValue;
  }

  while (fractionalDigits.at(-1) === '0') {
    fractionalDigits.pop();
  }

  return `${sign}${integerPart}${fractionalDigits.length ? `.${fractionalDigits.join('')}` : ''}`;
};

const buildPositionalFormula = (value: string, base: number) => {
  const unsignedValue = value.replace(/^-/, '');
  const [integerPart = '0', fractionalPart = ''] = unsignedValue.split('.');
  const integerTerms = [...integerPart].map((digit, index) => {
    const exponent = integerPart.length - index - 1;
    return `${digits.indexOf(digit)}\\cdot${base}^{${exponent}}`;
  });
  const fractionalTerms = [...fractionalPart].map((digit, index) => {
    return `${digits.indexOf(digit)}\\cdot${base}^{-${index + 1}}`;
  });
  const sign = value.startsWith('-') ? '-' : '';

  return `${sign}\\left(${[...integerTerms, ...fractionalTerms].join('+')}\\right)`;
};

const convertBetweenBases = ({ value, fromBase, toBase, precision = 16 }: BaseConversionInput) => {
  const normalizedValue = String(value ?? '').trim().replace(',', '.').toUpperCase();

  if (!normalizedValue || !Number.isInteger(fromBase) || !Number.isInteger(toBase)) {
    throw new Error('El valor y las bases son obligatorios.');
  }

  if (fromBase < 2 || toBase < 2 || fromBase > 36 || toBase > 36) {
    throw new Error('Las bases deben estar entre 2 y 36.');
  }

  if (!Number.isInteger(precision) || precision < 0 || precision > 64) {
    throw new Error('La precision debe ser un entero entre 0 y 64.');
  }

  const unsignedValue = normalizedValue.replace(/^-/, '');

  if (unsignedValue.split('.').length > 2 || !isValidForBase(unsignedValue, fromBase)) {
    throw new Error('El valor proporcionado no corresponde con la base de origen.');
  }

  const decimalValue = fromBaseToDecimal(normalizedValue, fromBase);
  const convertedValue = fromDecimalToBase(decimalValue, toBase, precision);

  return {
    type: 'base',
    originalValue: normalizedValue,
    fromBase,
    toBase,
    decimalValue,
    convertedValue,
    precision,
    procedure: {
      formulas: [
        `(${normalizedValue})_{${fromBase}}=${buildPositionalFormula(normalizedValue, fromBase)}=${mathNumber(decimalValue)}`,
        `(${mathNumber(decimalValue)})_{10}=(${convertedValue})_{${toBase}}`,
      ],
    },
  };
};

const calculateErrors = ({ actualValue, approximateValue }: ErrorInput) => {
  // Se aceptan expresiones como pi, sqrt(2) o 22/7 mediante mathjs.
  const actual = evaluateNumericExpression(actualValue);
  const approximate = evaluateNumericExpression(approximateValue);
  const absoluteError = Math.abs(actual - approximate);

  if (actual === 0) {
    throw new Error('El error relativo no esta definido cuando el valor real es cero.');
  }

  return {
    type: 'error',
    actualValue: actual,
    approximateValue: approximate,
    absoluteError,
    relativeError: absoluteError / Math.abs(actual),
    percentageError: (absoluteError / Math.abs(actual)) * 100,
    procedure: {
      formulas: [
        `E_a=|p-p^*|=|${mathNumber(actual)}-${mathNumber(approximate)}|=${mathNumber(absoluteError)}`,
        `E_r=\\frac{E_a}{|p|}=\\frac{${mathNumber(absoluteError)}}{|${mathNumber(actual)}|}=${mathNumber(absoluteError / Math.abs(actual))}`,
        `E_{\\%}=100E_r=${mathNumber((absoluteError / Math.abs(actual)) * 100)}\\%`,
      ],
    },
  };
};

export const convertBase = (input: ConversionInput) => {
  if (input.mode === 'error') {
    return calculateErrors(input);
  }

  return convertBetweenBases(input as BaseConversionInput);
};
