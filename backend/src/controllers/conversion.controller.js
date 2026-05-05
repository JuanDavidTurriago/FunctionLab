import { convertBase } from '../services/conversion.service.ts';

export const convertBaseController = (req, res, next) => {
  try {
    const result = convertBase(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
