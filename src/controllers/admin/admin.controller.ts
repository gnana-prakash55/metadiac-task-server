
import { Request, Response } from "express";
import GameType from "../../models/gametype.model";
import Manage from "../../models/manage.model";
import Users from "../../models/user.model";

export const ListUsers = async (req: Request, res: Response) => {
    try {

        if(req?.user?.role !== "admin") return res.status(401).send({message: "You are not allowed"})

        const users = await Users.find({ role: 'user' }, {
            name: 1,
            email: 1,
            role: 1
        })

        return res.status(200).send(users)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send("Server Error")
    }
}

export const AddGameTypes = async (req: Request, res: Response) => {
    try {

        if(req?.user?.role !== "admin") return res.status(401).send({message: "You are not allowed"})

        const { gameTypeId, gametype, price } = req.body

        console.log(req.body)

        if(gameTypeId ==="" || gametype === "" || price === "") return res.status(300).send({ message: "Please Fill All the Fields"})

        await GameType.updateOne({ _id : gameTypeId }, {
            $set: {
                name: gametype,
                price: price
            }
        })

        return res.status(200).send("Game Type Updated")
        
    } catch (error) {
        console.log(error)
        return res.status(500).send("Server Error")
    }
}

export const ListGameTypes = async (req: Request, res: Response) => {
    try {

        const gameTypes = await GameType.find({},{ name: 1, price: 1 })

        return res.status(200).send(gameTypes)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send("Server Error")
    }
}

export const DeleteGameType = async (req: Request, res: Response) => {
    try {

        if(req?.user?.role !== "admin") return res.status(401).send({message: "You are not allowed"})

        const { gameTypeId } = req.params

        await GameType.deleteOne({ _id: gameTypeId })

        return res.status(200).send({ message: "GameType Deleted"})
        
    } catch (error) {
        console.log(error)
        return res.status(500).send("Server Error")
    }
}

export const ManagePanel = async (req: Request, res: Response) => {
    try {

        if(req?.user?.role !== "admin") return res.status(401).send({message: "You are not allowed"})

        const { firstTimeInterval, secondTimeInterval, thirdTimeInterval} = req.body

        if(!(firstTimeInterval.interval < secondTimeInterval.interval && secondTimeInterval.interval < thirdTimeInterval.interval
            && firstTimeInterval.interval < thirdTimeInterval.interval)) return res.status(300).send({ message: "Intervals must be ascending order" })
        
        await Manage.updateOne({}, {
            $set: {
                firstTimeInterval,
                secondTimeInterval,
                thirdTimeInterval
            }
        })

        return res.status(200).send({ message: "Updated"})

    } catch (error) {
        console.log(error)
        return res.status(500).send("Server Error")
    }
}

export const getManagePanel = async (req: Request, res: Response) => {
    try {

        if(req?.user?.role !== "admin") return res.status(401).send({message: "You are not allowed"})

        const manage = await Manage.findOne({},{
            firstTimeInterval: 1,
            secondTimeInterval: 1,
            thirdTimeInterval: 1
        })

        return res.status(200).send(manage)

    } catch (error) {
        console.log(error)
        return res.status(500).send("Server Error")
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {

        if(req?.user?.role !== "admin") return res.status(401).send({message: "You are not allowed"})

        const { userId } = req.params

        await Users.deleteOne({ _id: userId })

        return res.status(200).send({message: "User Deleted"})

    } catch (error) {
        console.log(error)
        return res.status(500).send("Server Error")
    }
}