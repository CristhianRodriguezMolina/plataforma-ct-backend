import mongoose, { Schema, model } from 'mongoose';

const MazeSchema = new Schema({
	'activity_id': { ref: 'Activity', type: Schema.Types.ObjectId },
	'cols': { type: Number, default: 5, required: true },
	'rows': { type: Number, default: 5, required: true },
	'instructions': [{
		'type': { type: String, required: true },
	}],
	'cells': [{
		'i': { type: Number, required: true },
		'j': { type: Number, required: true },
		'type': { type: String, required: true },
	}]
}, { timestamps: true });

export default model('Maze', MazeSchema);