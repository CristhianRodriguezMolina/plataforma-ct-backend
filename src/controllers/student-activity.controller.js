//DB Schema imports
import StudentActivity from '../models/StudentActivity';
import Course from '../models/Course';
import Person from '../models/Person';
import Activity from '../models/Activity';
import { json } from 'express';

export const getAllStudentActivities = async (req, res) => {
	try {
		const studentActivities = await StudentActivity.find({});

		if (!studentActivities) {
			return res.status(200).json({ message: 'Aun no hay entidades student-activity' });
		} else if (studentActivities.length <= 0) {
			return res.status(200).json({ message: 'Aun no hay entidades student-activity' });
		}

		return res.status(200).json({ message: 'Entidades student-activity obtenidas con exito', studentActivities });
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Ha ocurrido un error en el servidor" })
	}
}

export const getStudentActivityById = async (req, res) => {
	try {
		const studentActivity = await StudentActivity.findById(req.params.id);

		if (!studentActivity) {
			return res.status(400).json({ message: 'Entidad student activity no encontrada' })
		}

		return res.status(200).json({ message: 'Entidad student activity obtenida satisfactoriamente', studentActivity })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Ha ocurrido un error en el servidor" })
	}
}

export const getStudentActivityByForeignIds = async (req, res) => {
	try {
		if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
			return res.status(400).json({ message: 'No envio datos para buscar la entidad student activity', found: false });
		}

		const studentActivity = await StudentActivity.find(req.body);
		if (!studentActivity) {
			return res.status(200).json({ message: 'Entidad student activity no encontrada o inexistente', found: false });
		} else if (studentActivity.length <= 0) {
			return res.status(200).json({ message: 'Entidad student activity no encontrada o inexistente', found: false });
		}

		return res.status(200).json({ message: 'Entidad student activity obtenida satisfactoriamente', found: true, studentActivity });
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Ha ocurrido un error en el servidor", found: false });
	}
}

export const createStudentActivity = async (req, res) => {
	try {
		const { courseId, unitId, taskId, activityId, studentId, type, answer } = req.body;

		const studentActivityCheck = await StudentActivity.findOne({
			student: studentId,
			course: courseId,
			task: taskId,
			activity: activityId
		});

		if (studentActivityCheck) {
			return res.status(400).json({ message: 'Ya existe una relación Student Activity con los datos proporcionados' });
		}

		const course = await Course.findById(courseId);

		if (!course) {
			return res.status(400).json({ message: 'Curso no encontrado' });
		}

		const unit = course.units.id(unitId);

		if (!unit) {
			return res.status(400).json({ message: "Unidad no encontrada" });
		}

		const task = unit.tasks.id(taskId);

		if (!task) {
			return res.status(400).json({ message: 'Tarea no encontrada' });
		}

		const activity = await Activity.findById(activityId);

		if (!activity) {
			return res.status(400).json({ message: 'Actividad no encontrada' });
		}

		const student = await Person.findById(studentId);

		if (!student) {
			return res.status(400).json({ message: 'Estudiante no encontrado' });
		}

		const studentActivity = new StudentActivity({
			course: courseId,
			unit: unitId,
			task: taskId,
			activity: activityId,
			student: studentId,
		})

		const savedStudentActivity = await studentActivity.save();

		return res.status(200).json({ message: 'Entidad student activity creada', savedStudentActivity })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Ha ocurrido un error en el servidor" })
	}
}

export const updateStudentActivityById = async (req, res) => {
	try {
		const { grade, complete, minutes, seconds, type, answer, attempts } = req.body;

		if (!grade && !complete && !answer && !type) {
			return res.status(400).json({ message: 'Falta los datos para editar la entidad StudentActivity' });
		}

		const updatedStudentActivity = await StudentActivity.findByIdAndUpdate(req.params.id, {
			grade,
			complete,
			minutes,
			seconds,
			answer,
			type,
			attempts
		}, { new: true });

		if (!updatedStudentActivity) {
			return res.status(400).json({ message: 'Entidad StudentActivity no entontrada' });
		}

		return res.status(200).json({ message: 'Entidad student activity actualizada satisfactoriamente', updatedStudentActivity })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Ha ocurrido un error en el servidor" })
	}
}

export const updateStudentActivityByForeignIds = async (req, res) => {
	try {
		const { courseId, taskId, activityId, studentId } = req.params;
		const { grade, complete } = req.body;

		if (!grade && !complete) {
			return res.status(400).json({ message: 'Falta los datos para editar la entidad StudentActivity' });
		}

		const updatedStudentActivity = await StudentActivity.findOneAndUpdate({
			student: studentId,
			course: courseId,
			task: taskId,
			activity: activityId
		}, req.body, {
			new: true
		});

		if (!updatedStudentActivity) {
			return res.status(400).json({ message: 'Entidad StudentActivity no entontrada' });
		}

		return res.status(200).json({ message: 'Entidad student activity actualizada satisfactoriamente', updatedStudentActivity })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Ha ocurrido un error en el servidor" })
	}
}

export const deleteStudentActivityById = async (req, res) => {
	try {
		const deletedStudentActivity = await StudentActivity.findByIdAndDelete(req.params.id);

		if (!deletedStudentActivity) {
			return res.status(400).json({ message: 'Entidad student activity no encontrada' })
		}

		return res.status(200).json({ message: 'Entidad student activity borrada satisfactoriamente', deletedStudentActivity })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Ha ocurrido un error en el servidor" })
	}
}

export const deleteStudentActivityByForeignIds = async (req, res) => {
	try {
		const { courseId, taskId, activityId, studentId } = req.params;

		const deletedStudentActivity = await StudentActivity.findOneAndDelete({
			student: studentId,
			course: courseId,
			task: taskId,
			activity: activityId
		});

		if (!deletedStudentActivity) {
			return res.status(400).json({ message: 'Entidad StudentActivity no entontrada' });
		}

		return res.status(200).json({ message: 'Entidad student activity borrada satisfactoriamente', deletedStudentActivity })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Ha ocurrido un error en el servidor" })
	}
}
