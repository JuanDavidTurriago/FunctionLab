import { solveBisection } from '../services/biseccion.service.ts';
import { solveNewton } from '../services/newton.service.ts';

export const solveBisectionController = (req, res, next) => {
  try {
    const result = solveBisection(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const solveNewtonController = (req, res, next) => {
  try {
    const result = solveNewton(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
