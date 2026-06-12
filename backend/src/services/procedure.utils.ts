export const mathNumber = (value: number, decimals = 8) => {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  // Los negativos se encierran entre parentesis para evitar ambiguedades
  // cuando se insertan dentro de productos o restas en LaTeX.
  const rounded = Number(value.toFixed(decimals));
  const absoluteValue = Math.abs(rounded);
  let formatted = String(rounded);

  if (absoluteValue !== 0 && (absoluteValue < 1e-5 || absoluteValue >= 1e8)) {
    const [mantissa, exponent] = rounded.toExponential(decimals).split('e');
    formatted = `${Number(mantissa)}\\times 10^{${Number(exponent)}}`;
  }

  return rounded < 0 ? `\\left(${formatted}\\right)` : formatted;
};

export const mathTuple = (values: number[]) => {
  return values.map((value) => mathNumber(value)).join(',\\;');
};
