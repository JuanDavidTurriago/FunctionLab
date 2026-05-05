import { interpolateLagrange } from '../services/lagrange.service.ts';
import { interpolateNewton } from '../services/newtonInterp.service.ts';

export const solveLagrangeController = (req, res, next) => {
  try {
    const result = interpolateLagrange(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const solveNewtonInterpolationController = (req, res, next) => {
  try {
    const result = interpolateNewton(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
