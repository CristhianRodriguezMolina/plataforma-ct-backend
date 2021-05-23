import mongoose, { Schema, model } from 'mongoose';

const LogicSequenceSchema = new Schema({
    'activity_id': { ref: 'Activity', type: Schema.Types.ObjectId },
    'sequence_cards': [{
        'name': { type: String, required: true, default: "My Sequence card", trim: true },
        'image': { type: String, required: false, default: "" }
        }]
}, { timestamps: true });

export default model('LogicSequence', LogicSequenceSchema);