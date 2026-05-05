import { solveSystemNewton } from '../services/sistemaNewton.service.ts';

export const solveSystemController = (req, res, next) => {
  try {
    const result = solveSystemNewton(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
