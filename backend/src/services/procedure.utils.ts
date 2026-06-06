export const mathNumber = (value: number, decimals = 8) => {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  // Los negativos se encierran entre parentesis para evitar ambiguedades
  // cuando se insertan dentro de productos o restas en LaTeX.
  const rounded = Number(value.toFixed(decimals));
  return rounded < 0 ? `(${rounded})` : String(rounded);
};

export const mathTuple = (values: number[]) => {
  return values.map((value) => mathNumber(value)).join(',\\;');
};
