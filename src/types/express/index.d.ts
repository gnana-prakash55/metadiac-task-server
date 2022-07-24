declare module Express {
  export interface Request {
      user: {
        _id: string,
        role: string
      }
  }
}