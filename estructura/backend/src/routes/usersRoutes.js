
import { Router } from 'express';

import * as authController from '../controllers/authController.js';
import * as usersController from '../controllers/usersController.js';
import { authJWT } from '../middlewares/authJWT.js';
import { soloAdmin, adminOPropietario } from '../middlewares/checkRol.js';

const router = Router();

//  Autenticación (públicas) 
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

//  Usuarios (protegidas) 
router.get('/users', authJWT, usersController.getUsers);
router.get('/users/:id', authJWT, usersController.getUserById);
router.put('/users/:id', authJWT, adminOPropietario, usersController.updateUser);
router.delete('/users/:id', authJWT, soloAdmin, usersController.deleteUser);

export default router;
