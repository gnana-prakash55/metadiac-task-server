import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/user.model";
import Wallet from "../../models/wallet.model";
import Game from "../../models/game.model";
import Manage from "../../models/manage.model";
import GameType from "../../models/gametype.model";

export const UserSignUp = async (req: Request, res: Response) => {
    try {

        const { name, email, password } = req.body

        if(name === "" || email === "" || password === "") return res.status(303).send({ message: "Please fill all the fields"})

        const duplicateCheck = await User.findOne({ email }, { _id: 1 })
        if(duplicateCheck) return res.status(303).send({ message: "User Already Exists"})

        const newUser = new User({
            ...req.body,
            role: "user"
        })
        newUser.password = bcrypt.hashSync(newUser.password, 12)

        await newUser.save()

        return res.status(201).send({ message: "User Created"})
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export const CreateWallet = async (req: Request, res: Response) => {
    try {

        if(req.user.role !== "user") return res.status(401).send("You are not allowed")

        const wallet = await Wallet.findOne({ userId: req.user._id }, { _id: 1})
        if(wallet) return res.status(300).send({ message: "Wallet created already"})

        const newWallet = new Wallet({
            userId: req.user._id,
            balance: 0
        })

        await newWallet.save()

        return res.status(201).send({ message: "Wallet Created" })
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export const AddAmountInWallet = async (req: Request, res: Response) => {
    try {

        if(req.user.role !== "user") return res.status(401).send("You are not allowed")

        const { amount } = req.body

        if(amount <= 0) return res.status(300).send({ message: "Amount should be greater than 0" })

        const wallet = await Wallet.findOne({ userId: req.user._id },{ balance: 1, balanceUpdated: 1 })

        if(wallet?.balanceUpdated) {
            var diff =(wallet?.balanceUpdated.getTime() - new Date().getTime()) / 1000;
            diff /= (60 * 60);
            const hours = Math.abs(Math.round(diff));

            if(hours < 24) return res.status(300).send({ message: "You can't add amount before 24 hours"})
        }

        await Wallet.updateOne({ userId: req.user._id }, {
            $set: {
                balance: wallet?.balance + amount,
                balanceUpdated: new Date()
            }
        })

        return res.status(200).send({ message: "Amount Added" })
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}


export const ShowBalanceInWallet = async (req: Request, res: Response) => {
    try {

        if(req.user.role !== "user") return res.status(401).send("You are not allowed")

        const wallet = await Wallet.findOne({ userId: req.user._id },{ balance: 1 })

        return res.status(200).send({ balance: wallet?.balance })
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}


export const saveGame = async (req: Request, res: Response) => {
    try {

        if(req.user.role !== "user") return res.status(401).send("You are not allowed")

        const { startTime, endTime, timeElapsed, gameType } = req.body

        const completed_minutes = Math.floor(timeElapsed / 60)

        const wallet = await Wallet.findOne({ userId: req.user._id }, { balance: 1 })
        const manage = await Manage.findOne({}, { firstTimeInterval: 1, secondTimeInterval: 1, thirdTimeInterval: 1 })

        const newGame = new Game({
            userId: req.user._id,
            startTime,
            endTime,
            timeElapsed,
            gameType
        })


        const gameTypes = await GameType.findOne({ _id: gameType }, { price: 1})

        if(completed_minutes <= (manage?.firstTimeInterval.interval as number)) {
 
            const amountWon = (((manage?.firstTimeInterval.percentage as number)/100) * (gameTypes?.price as number))
            const creditAmount = (wallet?.balance as number) +  amountWon

            await Wallet.updateOne({ userId: req.user._id }, {
                $set: {
                    balance: creditAmount
                }
            })

            newGame.amountWon = amountWon
            await newGame.save()

        } else if(completed_minutes > (manage?.firstTimeInterval.interval as number) && completed_minutes < (manage?.secondTimeInterval.interval as number)) {
            
            const amountWon = (((manage?.secondTimeInterval.percentage as number)/100) * (gameTypes?.price as number))
            const creditAmount = (wallet?.balance as number) +  amountWon
            await Wallet.updateOne({ userId: req.user._id }, {
                $set: {
                    balance: creditAmount
                }
            })

            newGame.amountWon = amountWon
            await newGame.save()

        } else if(completed_minutes > (manage?.thirdTimeInterval.interval as number)) {
            
            const amountWon = (((manage?.secondTimeInterval.percentage as number)/100) * (gameTypes?.price as number))
            const creditAmount = (wallet?.balance as number) +  amountWon
            await Wallet.updateOne({ userId: req.user._id }, {
                $set: {
                    balance: creditAmount
                }
            })

            newGame.amountWon = amountWon
            await newGame.save()
        }

        return res.status(200).send({ message: "Game Finished" })
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}


export const ScoreBoard = async (req: Request, res: Response) => {
    try {

        const scoreBoard = await Game.aggregate([
            {
               $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "users"
               }
            },
            {
                $unwind: {
                    path: "$users",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$users._id',
                    name: { $first: '$$ROOT.users.name'},
                    email: { $first: '$$ROOT.users.email' },
                    amountWon: { $sum: '$amountWon'}
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    amountWon: 1
                }
            },
            {
                $sort: {
                    amountWon: -1
                }
            }
        ])

        return res.status(200).send(scoreBoard)
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export const WalletAvailable = async (req: Request, res: Response) => {
    try {

        if(req.user.role !== "user") return res.status(401).send("You are not allowed")

        const { gameTypeId } = req.params

        const wallet = await Wallet.findOne({ userId: req.user._id }, { balance: 1})
        if(!wallet) res.status(300).send({ message: "Please create Wallet before start the Game"})

        const gameType = await GameType.findOne({ _id: gameTypeId }, { price: 1 })

        if((wallet?.balance as number) <= (gameType?.price as number)) res.status(300).send({ message: "Insufficient Balance"})

        return res.status(200).send({ message: "Wallet Available"})

        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}