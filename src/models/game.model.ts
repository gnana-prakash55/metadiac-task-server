
import mongoose,{ Schema, Document } from 'mongoose';

export interface Game extends Document {
    userId: mongoose.Types.ObjectId,
    startTime: Date,
    endTime: Date,
    timeElapsed: number,
    amountWon: number
}

const GameSchema: Schema = new Schema({
    
    userId: mongoose.Types.ObjectId,
    startTime: Date,
    endTime: Date,
    timeElapsed: Number,
    amountWon: Number
}
);

export default mongoose.model<Game>('Game', GameSchema)