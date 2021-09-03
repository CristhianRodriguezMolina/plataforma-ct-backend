import mongoose, { Schema, model } from 'mongoose';

const PerspectiveSchema = new Schema({
	'course': { ref: 'Course', type: Schema.Types.ObjectId },
	'student': { ref: 'Person', type: Schema.Types.ObjectId },
	'teacher': { ref: 'Person', type: Schema.Types.ObjectId },
	'course_name': { type: String, require: true },
	'course_description': { type: String, require: true },
	'teacher_name': { type: String, require: true },
	'message': { type: String, require: true },
}, { timestamps: true });

export default model('Perspective', PerspectiveSchema);
