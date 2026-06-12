export const toLatexNumber = (value, decimals = 8) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return String(value);
  }

  const rounded = Number(numericValue.toFixed(decimals));
  const normalized = Object.is(rounded, -0) ? 0 : rounded;
  const absoluteValue = Math.abs(normalized);

  if (absoluteValue !== 0 && (absoluteValue < 1e-5 || absoluteValue >= 1e8)) {
    const [mantissa, exponent] = normalized.toExponential(decimals).split('e');
    return `${Number(mantissa)}\\times 10^{${Number(exponent)}}`;
  }

  return String(normalized);
};

export const toLatexBaseValue = (value, base) => {
  return `\\left(\\mathtt{${String(value)}}\\right)_{${base}}`;
};
