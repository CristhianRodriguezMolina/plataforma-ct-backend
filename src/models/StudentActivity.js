import mongoose, { Schema, model } from 'mongoose';

const StudentActivitySchema = new Schema({
	'course': { ref: 'Course', type: Schema.Types.ObjectId },
	'unit': { ref: 'Course.Units', type: Schema.Types.ObjectId },
	'task': { ref: 'Course.units.tasks', type: Schema.Types.ObjectId },
	'activity': { ref: 'Activity', type: Schema.Types.ObjectId },
	'student': { ref: 'Person', type: Schema.Types.ObjectId },
	'grade': { type: Number, default: 0 },
	'complete': { type: Boolean, default: false },
	'date': Date
}, { timestamps: true });

export default model('StudentActivity', StudentActivitySchema);
