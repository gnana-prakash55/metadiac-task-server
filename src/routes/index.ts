import { Router } from "express";
import { adminRouter } from "./admin/admin.route";
import { authRouter } from "./auth/auth.route";
import { userRouter } from "./users/user.route";

export const masterRouter = Router()

masterRouter.use('/auth', authRouter)
masterRouter.use('/admin', adminRouter)
masterRouter.use('/user', userRouter)