import { Schema, model } from 'mongoose';

const CourseSchema = new Schema({
    'name': { type: String, require: true, trim: true },
    'description': { type: String, require: true },
    'topic': { type: String, require: true },    
    'creator': { ref: 'Person', type: Schema.Types.ObjectId },
    'visible': { type: Boolean },
    'image': String,
    'units': [{
        'name': { type: String, require: true, trim: true },
        'description': { type: String, require: true },
        'complete': Boolean,
        'visible': Boolean
    }],
    'tasks': [{
        'name': { type: String, require: true, trim: true },
        'complete': Boolean,
        'visible': Boolean
    }]
}, { timestamps: true });

export default model('Course', CourseSchema);