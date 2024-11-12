import mongoose from "mongoose";
import User from "./User.js";

const paymentSchema = new mongoose.Schema({

userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
},
amount: {
    type: Number,
    required: true
},
status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
},
description: {
    type: String
},
createdAt:{
    type: Date,
    default: Date.now,
}
});

export default mongoose.model("Payment", paymentSchema);
