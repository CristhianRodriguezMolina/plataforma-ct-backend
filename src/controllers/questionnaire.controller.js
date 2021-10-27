//DB Schema imports
import Questionnaire from "../models/Questionnaire";

// Create questionnaire
export const createQuestionnaire = async (activity_id) => {
	try {
		// The defatult opcions of a new questionnaire
		const questions = [{
			question: 'Pregunta 1',
			options: [{
				option: 'Opción 1',
			}]
		}]

		//Creating a new questionnaire model
		const newQuestionnaire = new Questionnaire({ activity_id, questions });

		// Save the questionnaire in the DB
		newQuestionnaire.save((err) => {
			if (err) {
				console.log("ERROR in createQuestionnaire (questionnaire.controller)");
				console.error(err)
				throw "Unexpected error, try again later!"
			}
		});
	} catch (error) {
		console.log(e)
		throw "Unexpected error, try again later!"
	}
}

// Get a questionnaire by the activity_id
export const getQuestionnaireByActivityId = (req, res) => {
	try {
		Questionnaire.findOne({ activity_id: req.params.id }).populate("activity_id")
			.then((result) => {
				if (result) {
					return res.status(200).json(result);
				}
				return res.status(400).json({ message: "Cuestionario no encontrado" });
			})
			.catch(err => {
				console.log("========== ERROR LOG IN QUESTIONNAIRE CONTROLLER getQuestionnaireByActivityId ==========")
				console.error(err);
				return res.status(500).json({ message: "An error has been found while we trying to get a Questionnaire" });
			});
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}

// Delete a questionnaire
export const deleteQuestionnaireByActivityId = async (activity_id) => {
	try {

		Questionnaire.findOneAndDelete({ activity_id }, (err) => {
			if (err) {
				console.log("ERROR found in deleteQuestionnaireByActivityId(questionnaire.controller)");
				console.error(err);
				throw "Unexpected error, try again later!";
			}
		});
	} catch (e) {
		console.log(e)
		throw "Unexpected error, try again later!";
	}
};

// Update a questionnaire
export const updateQuestionnaireByActivityId = async (activity_id, questionnaire_body, res) => {
	try {
		const { questions } = questionnaire_body;

		var questionnaire = await Questionnaire.findOne({ activity_id: activity_id });

		if (questionnaire) {

			// With this for, it verifies if a option has its option field empty or a question with its quesion field
			for (let j = 0; j < questions.length; j++) {
				const question = questions[j];

				if (question.question.trim() === "") {
					return res.status(400).json({ message: 'Ninguna pregunta puede estar vacia' })
				}

				for (let i = 0; i < question.options.length; i++) {
					const option = question.options[i];
					if (option.option.trim() === '') {
						return res.status(400).json({ message: 'Ninguna pregunta puede tener opciones vacias' })
					}
				}
			}

			// Se actualizan las preguntas del cuestionario
			questionnaire.questions = questions;

			// Se guarda el cuestionario
			await questionnaire.save();

			return { message: "Cuestionario actualizado satisfactoriamente" };
		} else {
			return { message: "Cuestionario no encontrado" };
		}

	} catch (e) {
		console.log(e)
		throw "Unexpected error, try again later!";
	}
};

// METHODS FOR QUESTIONS --------------------------------------------------------------------------------------

// Create a new question in a questionnaire by the id
export const createQuestionByQuestionnaireId = async (req, res) => {
	try {

		const questionnaire = await Questionnaire.findById(req.params.id);

		if (!questionnaire) {
			return res.status(400).json({ message: 'Cuestionario no encontrado o inexistente' })
		}

		questionnaire.questions.push({
			question: `Pregunta ${questionnaire.questions.length + 1}`,
			options: [{
				option: 'Opción 1',
			}]
		});

		const updatedQuestionnaire = await questionnaire.save();

		return res.status(201).json({ message: 'Pregunta del cuestionario actualizado satisfactoriamente', updatedQuestionnaire });
	} catch (error) {
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}

// Delete a new question in a questionnaire by the id
export const deleteQuestionByQuestionnaireId = async (req, res) => {
	try {

		const questionnaire = await Questionnaire.findById(req.params.id);

		if (!questionnaire) {
			return res.status(400).json({ message: 'Cuestionario no encontrado o inexistente' })
		}

		const questionToRemove = questionnaire.questions.id(req.params.questionId);

		if (!questionToRemove) {
			return res.status(404).json({ message: 'Pregunta no encontrada o inexistente' })
		}

		questionToRemove.remove();

		const updatedQuestionnaire = await questionnaire.save();

		return res.status(201).json({ message: 'Pregunta del cuestionario eliminada satisfactoriamente', updatedQuestionnaire });
	} catch (error) {
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}

// Update a new question in a questionnaire by the id
export const updateQuestionByQuestionnaireId = async (req, res) => {
	try {
		const { question, options } = req.body;

		if (!question && !options) {
			return res.status(400).json({ message: "Campos requeridos!" });
		}

		if (question.trim() === '') {
			return res.status(400).json({ message: "No pueden haber preguntas vacias!" });
		}

		const questionnaire = await Questionnaire.findById(req.params.id);

		if (!questionnaire) {
			return res.status(400).json({ message: 'Cuestionario no encontrado o inexistente' })
		}

		const questionToUpdate = questionnaire.questions.id(req.params.questionId);

		if (!questionToUpdate) {
			return res.status(404).json({ message: 'Pregunta no encontrada o inexistente' })
		}

		// With this for, it verifies if a option has in option field empty
		for (let i = 0; i < options.length; i++) {
			const option = options[i];
			if (option.option.trim() === '') {
				return res.status(400).json({ message: 'La pregunta no puede tener opciones vacias' })
			}
		}

		// The questionnaire question is updated
		questionToUpdate.question = question;
		questionToUpdate.options = options;

		const updatedQuestionnaire = await questionnaire.save();

		return res.status(201).json({ message: 'Pregunta del cuestionario actualizada satisfactoriamente', updatedQuestionnaire });
	} catch (error) {
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}

// METHODS FOR OPTIONS --------------------------------------------------------------------------------------

// Create a new option in a question inside a questionnaire by the ids
export const createOptionByQuestionnaireAndQuestionId = async (req, res) => {
	try {
		const questionnaire = await Questionnaire.findById(req.params.id);

		if (!questionnaire) {
			return res.status(400).json({ message: 'Cuestionario no encontrado o inexistente' })
		}

		const question = questionnaire.questions.id(req.params.questionId);

		if (!question) {
			return res.status(404).json({ message: 'Pregunta no encontrada o inexistente' })
		}

		// Add a new option to the question
		question.options.push({
			option: `Opción ${question.options.length + 1}`,
		})

		const updatedQuestionnaire = await questionnaire.save();

		return res.status(201).json({ message: 'Pregunta del cuestionario actualizado satisfactoriamente', updatedQuestion: question });
	} catch (error) {
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}

// Delete a new option in a question inside a questionnaire by the ids
export const deleteOptionByQuestionnaireAndQuestionId = async (req, res) => {
	try {
		const questionnaire = await Questionnaire.findById(req.params.id);

		if (!questionnaire) {
			return res.status(400).json({ message: 'Cuestionario no encontrado o inexistente' })
		}

		const question = questionnaire.questions.id(req.params.questionId);

		if (!question) {
			return res.status(404).json({ message: 'Pregunta no encontrada o inexistente' })
		}

		const optionToRemove = question.options.id(req.params.optionId);

		if (!optionToRemove) {
			return res.status(404).json({ message: 'Option no encontrada o inexistente' })
		}

		optionToRemove.remove();

		const updatedQuestionnaire = await questionnaire.save();

		return res.status(201).json({ message: 'Pregunta del cuestionario actualizado satisfactoriamente', updatedQuestion: question });
	} catch (error) {
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}

// Update a new option in a question inside a questionnaire by the ids
export const updateOptionByQuestionnaireAndQuestionId = async (req, res) => {
	try {
		const { option, image, isCorrect } = req.body;

		if (!option && !image) {
			return res.status(400).json({ message: "Campos requeridos!" });
		}

		if (option.trim() === '') {
			return res.status(400).json({ message: "Campos requeridos!" });
		}

		const questionnaire = await Questionnaire.findById(req.params.id);

		if (!questionnaire) {
			return res.status(400).json({ message: 'Cuestionario no encontrado o inexistente' })
		}

		const question = questionnaire.questions.id(req.params.questionId);

		if (!question) {
			return res.status(404).json({ message: 'Pregunta no encontrada o inexistente' })
		}

		const optionToUpdate = question.options.id(req.params.optionId);

		if (!optionToUpdate) {
			return res.status(404).json({ message: 'Option no encontrada o inexistente' })
		}

		// The question option is updated
		optionToUpdate.option = option;
		optionToUpdate.image = image;
		optionToUpdate.isCorrect = isCorrect;

		const updatedQuestionnaire = await questionnaire.save();

		return res.status(201).json({ message: 'Pregunta del cuestionario actualizado satisfactoriamente', updatedQuestionnaire });
	} catch (error) {
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}
