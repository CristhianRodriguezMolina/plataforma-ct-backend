//Mongoose schemas
import LogicSequence from '../models/LogicSequence';
import Course from '../models/Course';
import Person from '../models/Person';
import Questionnaire from '../models/Questionnaire';

import fs from 'fs';
import path from 'path';

export const uploadOptionImg = async (req, res) => {
	try {
		const { file } = req;

		if (!file) {
			return res.status(400).json({ message: "The image couldn't be uploaded, make sure you are uploading an image file or check your internet connection" });
		}

		const questionnaire = await Questionnaire.findById(req.params.questionnaireId);

		if (!questionnaire) {
			return res.status(400).json({ message: 'Cuestionario no encontrado o inexistente' })
		}

		const question = questionnaire.questions.id(req.params.questionId);

		if (!question) {
			return res.status(404).json({ message: 'Pregunta no encontrada o inexistente' })
		}

		const option = question.options.id(req.params.optionId);

		if (!option) {
			return res.status(404).json({ message: 'Option no encontrada o inexistente' })
		}

		let filePath = path.join(__dirname, `../../static_content/questionnaire/${option.image}`);

		if (fs.existsSync(filePath)) {
			fs.unlink(filePath, (er) => {
				if (er) return console.log(er);
				console.log(`file deleted successfully: ${filePath}`);
			});
		}

		option.image = file.filename;

		const updatedQuestionnaire = await questionnaire.save();

		return res.status(201).json({ message: 'Imagen del curso actualizada satisfactoriamente', updatedQuestion: question });
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
};

export const uploadQuestionImg = async (req, res) => {
	try {
		const { file } = req;

		if (!file) {
			return res.status(400).json({ message: "The image couldn't be uploaded, make sure you are uploading an image file or check your internet connection" });
		}

		const questionnaire = await Questionnaire.findById(req.params.questionnaireId);

		if (!questionnaire) {
			return res.status(400).json({ message: 'Cuestionario no encontrado o inexistente' })
		}

		const question = questionnaire.questions.id(req.params.questionId);

		if (!question) {
			return res.status(404).json({ message: 'Pregunta no encontrada o inexistente' })
		}

		let filePath = path.join(__dirname, `../../static_content/questionnaire/${question.image}`);

		if (fs.existsSync(filePath)) {
			fs.unlink(filePath, (er) => {
				if (er) return console.log(er);
				console.log(`file deleted successfully: ${filePath}`);
			});
		}

		question.image = file.filename;

		const updatedQuestionnaire = await questionnaire.save();

		return res.status(201).json({ message: 'Imagen del curso actualizada satisfactoriamente', updatedQuestionnaire });
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
};

export const uploadProfileUserImg = async (req, res) => {
	try {
		const { file, body } = req;

		if (!(file && body)) {
			return res.status(400).json({ message: "The image couldn't be uploaded, make sure you are uploading an image file or check your internet connection" });
		}

		const user = await Person.findById(req.params.userId);

		if (!user) {
			return res.status(400).json({ message: 'Usuario no encontrado o inexsistente al subir una imagen' });
		}

		if (user.image) {
			let filePath = path.join(__dirname, `../../static_content/profile/${user.image}`);

			if (fs.existsSync(filePath)) {
				fs.unlink(filePath, (er) => {
					if (er) return console.log(er);
					console.log(`file deleted successfully: ${filePath}`);
				});
			}
		}

		user.image = file.filename;

		const updatedUser = await user.save();

		return res.status(201).json({ message: 'Imagen de perfil actualizada satisfactoriamente', updatedUser })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}

export const uploadCourseImg = async (req, res) => {
	try {
		const { file, body } = req;

		if (!(file && body)) {
			return res.status(400).json({ message: "The image couldn't be uploaded, make sure you are uploading an image file or check your internet connection" });
		}

		const course = await Course.findById(req.params.courseId);

		if (!course) {
			return res.status(400).json({ message: 'Curso no encontrado o inexsistente al subir una imagen' });
		}

		if (course.image !== 'default-course-image.jpg') {
			let filePath = path.join(__dirname, `../../static_content/course-images/${course.image}`);

			if (fs.existsSync(filePath)) {
				fs.unlink(filePath, (er) => {
					if (er) return console.log(er);
					console.log(`file deleted successfully: ${filePath}`);
				});
			}
		}

		course.image = file.filename;

		const updatedCourse = await course.save();

		return res.status(201).json({ message: 'Imagen del curso actualizada satisfactoriamente', updatedCourse })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}

export const uploadImg = (req, res) => {

	try {
		if (!req.file) {
			return res.status(400).json({ message: "The image couldn't be uploaded, make sure you are uploading an image file or check your internet connection" });
		}

		LogicSequence.findById(req.params.logic_sequence_id, (err, oldLogicSequence) => {
			if (err) {
				console.log('err');
				console.log(err);
				return res.status(500).json({ message: "Unexpected error, try again later!" });
			}

			if (oldLogicSequence) {
				const filename = req.file.filename;
				/**
				 * Search the sequence card to update image
				 */
				LogicSequence.findOneAndUpdate({
					"_id": req.params.logic_sequence_id,
					"sequence_cards._id": req.params.sequence_card_id
				}, {
					"$set": {
						"sequence_cards.$.name": req.body.name,
						"sequence_cards.$.image": filename
					}
				}, {
					new: true
				}, (error, result) => {
					if (error) {
						console.log('error');
						console.log(error);
						return res.status(500).json({ message: "An error has ocurred when we trying to update a sequence card" });
					}
					if (result) {
						let length = oldLogicSequence.sequence_cards.length;
						let found = false;
						let sequenceCard;
						for (let i = 0; i < length && !found; i++) {
							let tempSequenceCard = oldLogicSequence.sequence_cards[i];
							if (tempSequenceCard._id.equals(req.params.sequence_card_id)) {
								found = true;
								sequenceCard = tempSequenceCard;
							}
						}
						let filePath = path.join(__dirname, `../../static_content/i/${sequenceCard.image}`);
						if (fs.existsSync(filePath)) {
							fs.unlink(filePath, (er) => {
								if (er) return console.log(er);
								console.log(`file deleted successfully: ${filePath}`);
							});
						}
						return res.status(201).json({ message: "The Sequence card has been updated satisfatorily", updatedLogicSequence: result })
					} else {
						return res.status(400).json({ message: "The logic sequence or the sequence card not found" });
					}
				}
				);
			} else {
				return res.status(400).json({ message: "Logic sequence not found" });
			}
		});
	}
	catch (e) {
		console.log('e');
		console.log(e);
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}
