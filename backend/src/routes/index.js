import { Router } from 'express';
import { calculateTaylor } from '../controllers/taylor.controller.js';
import {
  solveBisectionController,
  solveNewtonController,
} from '../controllers/ecuaciones.controller.js';
import { solveSystemController } from '../controllers/sistemas.controller.js';
import {
  solveLagrangeController,
  solveNewtonInterpolationController,
} from '../controllers/interpolacion.controller.js';
import { convertBaseController } from '../controllers/conversion.controller.js';

const router = Router();

// La capa de rutas solo relaciona una URL con su controlador.
// La validacion numerica y los calculos permanecen en los servicios.
router.post('/taylor', calculateTaylor);
router.post('/biseccion', solveBisectionController);
router.post('/newton', solveNewtonController);
router.post('/sistemas', solveSystemController);
router.post('/lagrange', solveLagrangeController);
router.post('/newton-interpolacion', solveNewtonInterpolationController);
router.post('/conversion', convertBaseController);

export default router;
