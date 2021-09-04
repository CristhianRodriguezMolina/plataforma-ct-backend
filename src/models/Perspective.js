import mongoose, { Schema, model } from 'mongoose';

const PerspectiveSchema = new Schema({
	'course': { ref: 'Course', type: Schema.Types.ObjectId },
	'student': { ref: 'Person', type: Schema.Types.ObjectId },
	'teacher': { ref: 'Person', type: Schema.Types.ObjectId },
	'message': { type: String, require: true },
}, { timestamps: true });

export default model('Perspective', PerspectiveSchema);
