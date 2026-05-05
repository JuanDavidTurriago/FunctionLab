import { calculateTaylorSeries } from '../services/taylor.service.ts';

export const calculateTaylor = (req, res, next) => {
  try {
    const result = calculateTaylorSeries(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
