import mongoose, { Schema, model } from 'mongoose';

const LogicSequenceSchema = new Schema({
    'sequenceCard': [{
        'name': { type: String, required: true, default: "", trim: true },
        'image': { type: String, required: false, default: "" },
        }]
}, { timestamps: true });

export default model('LogicSequence', LogicSequenceSchema);