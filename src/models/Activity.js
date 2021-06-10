import mongoose, { Schema, model } from 'mongoose';

const ActivitySchema = new Schema({
    'name': { type: String, required: true, default: "My Activity", trim: true },
    'description': { type: String, required: false, default: "", trim: true },
    'type': { type: String, default: "logic_sequence", trim: true },
    'creator': { ref: 'Person', type: Schema.Types.ObjectId },
    'score': { type: Number, default: 0 },
    'completed': { type: Boolean, default: false },
    'public': { type: Boolean, default: false },
    'date': { type: Date, default: Date.now }
}, { timestamps: true });

export default model('Activity', ActivitySchema);