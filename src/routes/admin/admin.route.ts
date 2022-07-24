import { Router } from "express";
import { ListUsers, ListGameTypes, ManagePanel, getManagePanel, deleteUser, AddGameTypes } from "../../controllers/admin/admin.controller"
import { authorization } from "../../controllers/middleware/authorization";

export const adminRouter = Router()

adminRouter.get('/users', authorization ,ListUsers)
adminRouter.post('/manage', authorization ,ManagePanel)
adminRouter.get('/manage', authorization ,getManagePanel)
adminRouter.delete('/user/:userId', authorization ,deleteUser)
adminRouter.post('/gameTypes', authorization , AddGameTypes)
adminRouter.get('/gameTypes', authorization ,ListGameTypes)