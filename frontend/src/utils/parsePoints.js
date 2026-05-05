export const parsePoints = (pointsText) => {
  const points = pointsText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [x, y] = line.split(',').map((value) => Number(value.trim()));
      return { x, y };
    });

  if (!points.length || points.some((point) => !Number.isFinite(point.x) || !Number.isFinite(point.y))) {
    throw new Error('Ingresa los puntos con el formato x,y en cada linea.');
  }

  return points;
};
