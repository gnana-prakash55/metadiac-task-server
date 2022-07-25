import { Router } from 'express';
import { authorization } from '../../controllers/middleware/authorization';
import { AddAmountInWallet, CreateWallet, saveGame, ScoreBoard, ShowBalanceInWallet, UserSignUp, WalletAvailable } from '../../controllers/users/user.controller';

export const userRouter = Router()

userRouter.post('/signup', UserSignUp)
userRouter.post('/wallet', authorization, CreateWallet)
userRouter.post('/wallet/amount', authorization, AddAmountInWallet)
userRouter.get('/wallet/balance', authorization, ShowBalanceInWallet)
userRouter.post('/game/save', authorization, saveGame)
userRouter.get('/game/scoreboard', authorization, ScoreBoard)
userRouter.get('/wallet/available/:gameTypeId', authorization, WalletAvailable)
