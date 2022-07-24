
import mongoose,{ Schema, Document } from 'mongoose';

export interface GameType extends Document {
    name: string
    dateTime: Date
}

const GameTypeSchema: Schema = new Schema({
    name: String,
    dateTime: Date
}
);

export default mongoose.model<GameType>('GameType', GameTypeSchema)