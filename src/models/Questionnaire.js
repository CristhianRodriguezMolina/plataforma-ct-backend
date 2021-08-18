import mongoose, { Schema, model } from 'mongoose';

const QuestionnaireSchema = new Schema({
	'activity_id': { ref: 'Activity', type: Schema.Types.ObjectId },
	'questions': [{
		'question': { type: String, required: true, trim: true },
		'image': { type: String, default: "", trim: true },
		'options': [{
			'option': { type: String, required: true, trim: true },
			'image': { type: String, default: "", trim: true },
			'isCorrect': { type: Boolean, default: false },
		}]
	}]
}, { timestamps: true });

export default model('Questionnaire', QuestionnaireSchema);