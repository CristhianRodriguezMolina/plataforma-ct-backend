import mongoose, { Schema, model } from 'mongoose';

const CourseSchema = new Schema({
    'name': { type: String, require: true, trim: true },
    'description': { type: String, require: true },
    'topic': { type: String, require: true },    
    'creator': { ref: 'Person', type: Schema.Types.ObjectId },
    'visible': { type: Boolean },
    'image': String,
    'actual_unit': { type: String, default: "There is no unit" },
    'due_date': Date,
    'students': { type: Number, default: 0 },
    'units': [{
        'name': { type: String, require: true, trim: true },
        'description': { type: String, require: true },
        'complete': Boolean,
        'visible': Boolean,
        'tasks': [{
            'name': { type: String, require: true, trim: true },
            'complete': Boolean,
            'visible': Boolean
        }]
    }]    
}, { timestamps: true });

export default model('Course', CourseSchema);