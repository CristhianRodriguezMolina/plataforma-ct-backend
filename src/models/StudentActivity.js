import mongoose, { Schema, model } from 'mongoose';

const StudentActivitySchema = new Schema({
	'course': { ref: 'Course', type: Schema.Types.ObjectId },
	'unit': { ref: 'Course.Units', type: Schema.Types.ObjectId },
	'task': { ref: 'Course.units.tasks', type: Schema.Types.ObjectId },
	'activity': { ref: 'Activity', type: Schema.Types.ObjectId },
	'student': { ref: 'Person', type: Schema.Types.ObjectId },
	'grade': { type: Number, default: 0 },
	'complete': { type: Boolean, default: false },
	'minutes': { type: String, default: '00' },
	'seconds': { type: String, default: '00' },
	'answer': [{ type: Object }],
	'type': { type: Object },
	'attempts': { type: Number, default: 0}
}, { timestamps: true });

export default model('StudentActivity', StudentActivitySchema);
