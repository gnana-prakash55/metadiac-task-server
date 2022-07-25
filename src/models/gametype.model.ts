
import mongoose,{ Schema, Document } from 'mongoose';

export interface GameType extends Document {
    name: string
    dateTime: Date
    price: number
}

const GameTypeSchema: Schema = new Schema({
    name: String,
    dateTime: Date,
    price: Number
}
);

export default mongoose.model<GameType>('GameType', GameTypeSchema)