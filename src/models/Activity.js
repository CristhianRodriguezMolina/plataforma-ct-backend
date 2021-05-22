import mongoose, { Schema, model } from 'mongoose';

const ActivitySchema = new Schema({
    'name': { type: String, required: true, default: "", trim: true },
    'description': { type: String, required: false, default: "", trim: true },
    'type': { type: String, default: "", trim: true },
    'score': { type: Number, default: 0 },
    'completed': { type: Boolean, default: false },
    'public': { type: Boolean, default: false },
    'date': { type: Date , default: Date.now }
}, { timestamps: true });

export default model('Activity', ActivitySchema);