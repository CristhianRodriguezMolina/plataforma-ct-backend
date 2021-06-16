import mongoose, { Schema, model } from 'mongoose';

const StudentActivitySchema = new Schema({
	'activity': { ref: 'Activity', type: Schema.Types.ObjectId },
	'task': { ref: 'Course.units.tasks', type: Schema.Types.ObjectId },
	'student': { ref: 'Person', type: Schema.Types.ObjectId }
}, { timestamps: true });

export default model('StudentActivity', StudentActivitySchema);