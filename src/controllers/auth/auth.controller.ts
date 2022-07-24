import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../../models/user.model";

export const login =  async (req:Request, res: Response) => {

    try {

        const { email, password } = req.body

        if(email === "" || password === "") return res.status(300).send({ message: "Fill All the Fields"})

        const user  = await User.findOne({ email })
        if(!user) return res.status(404).send({ message: "User Not Found"})

        const passwordCheck = await bcrypt.compare(password, user.password)
        if(!passwordCheck) return res.status(401).send({message:"Invalid email/password"})

        let payload = {
            _id: user._id,
            name: user.name,
            role: user.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: "5h"
        })

        return res.status(200).send({ jwtToken: token, role: user.role })

        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

}

export const checkAuthStatus = (req: Request, res: Response) => {
    try {

        return res.status(200).send({
            role: req.user?.role
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}