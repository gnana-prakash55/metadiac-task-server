
import mongoose,{ Schema, Document } from 'mongoose';

export interface Manage extends Document {
   firstTimeInterval: {
        interval: number,
        percentage: number
   },
   secondTimeInterval: {
        interval: number,
        percentage: number
    },
    thirdTimeInterval: {
        interval: number,
        percentage: number
   },
   gameTypes:[string]
}

const GameSchema: Schema = new Schema({
    firstTimeInterval: {
        interval: Number,
        percentage: Number
   },
   secondTimeInterval: {
        interval: Number,
        percentage: Number
    },
    thirdTimeInterval: {
        interval: Number,
        percentage: Number
   },
   gameTypes: [String]
  
}
);

export default mongoose.model<Manage>('Manage', GameSchema)