interface ConversionInput {
  value: string;
  fromBase: number;
  toBase: number;
}

const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const isValidForBase = (value: string, base: number) => {
  return [...value].every((digit) => {
    const digitValue = digits.indexOf(digit);
    return digitValue >= 0 && digitValue < base;
  });
};

export const convertBase = ({ value, fromBase, toBase }: ConversionInput) => {
  const normalizedValue = String(value ?? '').trim().toUpperCase();

  if (!normalizedValue || !Number.isInteger(fromBase) || !Number.isInteger(toBase)) {
    throw new Error('El valor y las bases son obligatorios.');
  }

  if (fromBase < 2 || toBase < 2 || fromBase > 36 || toBase > 36) {
    throw new Error('Las bases deben estar entre 2 y 36.');
  }

  if (!isValidForBase(normalizedValue, fromBase)) {
    throw new Error('El valor proporcionado no corresponde con la base de origen.');
  }

  const decimalValue = parseInt(normalizedValue, fromBase);

  return {
    originalValue: normalizedValue,
    fromBase,
    toBase,
    decimalValue,
    convertedValue: decimalValue.toString(toBase).toUpperCase(),
  };
};
