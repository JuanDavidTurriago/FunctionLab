import { calculateTaylorSeries } from '../services/taylor.service.ts';

export const calculateTaylor = (req, res, next) => {
  try {
    // El controlador adapta HTTP a una llamada normal de TypeScript.
    const result = calculateTaylorSeries(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    // Express entrega el error al middleware central definido en app.js.
    next(error);
  }
};
