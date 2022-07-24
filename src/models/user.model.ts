
import mongoose,{ Schema, Document } from 'mongoose';

export interface User extends Document {
    name: string,
    email: string,
    password: string,
    role: string
}

const UserSchema: Schema = new Schema({
    
    name: String,
    email: String,
    password: String,
    role: String

});

export default mongoose.model<User>('Users', UserSchema)