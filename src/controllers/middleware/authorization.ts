import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';

interface JwtExpPayload {
    _id: string,
    name: string,
    role: string
}

export const authorization = (req: Request, res: Response, next: NextFunction) => {
    
    try {

      const token =  req.headers.authorization?.replace('Bearer ','') || ''

      if (!token) {
        return res.sendStatus(403);
      }
  
      const data = jwt.verify(token, process.env.JWT_SECRET as string) as JwtExpPayload;
      if(!data) return res.sendStatus(403);
      req.user = {
        _id: data._id,
        role: data.role
      } ;

      return next();

    } catch(error) {
      return res.sendStatus(403);

    }
  };