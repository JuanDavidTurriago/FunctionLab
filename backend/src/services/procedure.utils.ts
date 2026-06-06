export const mathNumber = (value: number, decimals = 8) => {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  const rounded = Number(value.toFixed(decimals));
  return rounded < 0 ? `(${rounded})` : String(rounded);
};

export const mathTuple = (values: number[]) => {
  return values.map((value) => mathNumber(value)).join(',\\;');
};
