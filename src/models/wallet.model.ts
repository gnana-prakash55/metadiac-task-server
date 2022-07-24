import mongoose,{ Schema, Document } from 'mongoose';

export interface Wallet extends Document {
    userId: string,
    balance: number,
    balanceUpdated: Date
}

const WalletSchema: Schema = new Schema({
    
    userId: mongoose.Types.ObjectId,
    balance: Number,
    balanceUpdated: Date

}, {

    timestamps: true

});

export default mongoose.model<Wallet>('Wallet', WalletSchema)