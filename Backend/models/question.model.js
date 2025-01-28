import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true, unique: true },
    options: [{ type: String, required: true, unique: true }],
    correctAns: { type: String, required: true },
}, { timestamps: true });

export const Question = mongoose.model('Question', questionSchema);