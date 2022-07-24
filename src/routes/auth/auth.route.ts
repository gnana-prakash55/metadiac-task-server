import { Router } from "express";
import { checkAuthStatus, login } from "../../controllers/auth/auth.controller";
import { authorization } from "../../controllers/middleware/authorization";

export const authRouter = Router()

authRouter.post('/signin', login)
authRouter.get('/checkAuthStatus', authorization,checkAuthStatus)