import mongoose, { Schema, model } from 'mongoose';

const CourseSchema = new Schema({
    'name': { type: String, require: true, trim: true },
    'description': { type: String, require: true },
    'topic': { type: String, require: true },    
    'creator': { ref: 'Person', type: Schema.Types.ObjectId },
    'visible': Boolean,
    'image': String,
    'actual_unit': String,
    'due_date': Date,
    'students': { type: Number, default: 0 },
    'units': [{
        'name': { type: String, require: true, trim: true },
        'description': { type: String, require: true },
        'visible': { type: Boolean, default: false },
        'tasks': [{
            'name': { type: String, require: true, trim: true },
            'complete': Boolean,
            'visible': Boolean
        }]
    }]    
}, { timestamps: true });

export default model('Course', CourseSchema);