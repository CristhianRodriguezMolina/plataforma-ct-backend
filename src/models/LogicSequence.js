import mongoose, { Schema, model } from 'mongoose';

const LogicSequenceSchema = new Schema({
    'activity_id': { ref: 'Activity', type: Schema.Types.ObjectId },
    'sequenceCard': [{
        'name': { type: String, required: true, default: "", trim: true },
        'image': { type: String, required: false, default: "" }
        }]
}, { timestamps: true });

export default model('LogicSequence', LogicSequenceSchema);