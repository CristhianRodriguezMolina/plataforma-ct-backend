import mongoose, { Schema, model } from 'mongoose';

const CourseSchema = new Schema({
    'name': { type: String, require: true, trim: true },
    'description': { type: String, require: true },
    'topic': { type: String, require: true },
    'creator': { ref: 'Person', type: Schema.Types.ObjectId },
    'visible': Boolean,
    'image': { type: String, default: '' },
    'actual_unit': String,
    'due_date': Date,
    'students': { type: Number, default: 0 },
    'units': [{
        'name': { type: String, require: true, trim: true },
        'description': { type: String, require: true },
        'visible': { type: Boolean, default: false },
        'is_due_date': { type: Boolean, default: false },
        'due_date': Date,
        'tasks': [{
            'name': { type: String, require: true, trim: true },
            'description': { type: String, default: '', trim: true },
            'is_due_date': { type: Boolean, default: false },
            'due_date': Date,
            'visible': { type: Boolean, default: false }
        }]
    }]
}, { timestamps: true });

export default model('Course', CourseSchema);