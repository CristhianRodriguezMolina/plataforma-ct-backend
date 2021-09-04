//DB schemas import
import Perspective from "../models/Perspective";
import Course from "../models/Course";
import Person from "../models/Person";

export const createPerspective = async (req, res) => {
	try {
		const course = await Course.findById(req.params.courseId);
		const teacher = await Person.findById(req.params.teacherId);
		const student = await Person.findById(req.params.studentId);
		if (!course) {
			return res.status(404).json({ message: '¡Curso no encontrado!' });
		}

		if (!teacher) {
			return res.status(404).json({ message: 'Profesor no encontrado' });
		}

		if (!student) {
			return res.status(404).json({ message: 'Estudiante no encontrado' });
		}

		const newPerspective = new Perspective({
			course: course._id,
			teacher: teacher._id,
			student: student._id,
			message: req.body.message
		});

		const perspectiveTemp = await newPerspective.save();

		const savedPerspective = await Perspective.findById(perspectiveTemp._id).populate([{ path: 'student', select: ['first_name', 'last_name'] }, { path: 'teacher', select: ['first_name', 'last_name'] }, , { path: 'course', select: ['name', 'description'] }]);

		return res.status(201).json({ message: "Perspectiva creada exitosamente", perspective: savedPerspective });

	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
};

export const updatePerspectiveByPerspectiveId = async (req, res) => {
	try {

		if (!req.body.message) {
			return res.status(400).json({ message: '¡El mensaje es requerido!' });
		}

		if (req.body.message.trim() === '') {
			return res.status(400).json({ message: '¡El mensaje es requerido!' });
		}

		const updatedPerspective = await Perspective.findByIdAndUpdate(req.params.perspectiveId, req.body, { new: true });

		return res.status(201).json({ message: "Perspectiva actualizada exitosamente", updatedPerspective });

	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
};

export const deletePerspectiveByPerspectiveId = async (req, res) => {
	try {
		await Perspective.findByIdAndDelete(req.params.perspectiveId);

		return res.status(201).json({ message: "¡Perspectiva eliminada satisfactoriamente!" });

	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
};

export const getPerspectiveByPersonId = async (req, res) => {
	try {
		var perspectives;
		if (req.params.person === 'teacher' || req.params.person === 'admin') {
			perspectives = await Perspective.find({ teacher: req.params.personId })
				.populate([{ path: 'student', select: ['first_name', 'last_name'] }, { path: 'teacher', select: ['first_name', 'last_name'] }, , { path: 'course', select: ['name', 'description'] }]);
		}
		else if (req.params.person === 'student') {
			perspectives = await Perspective.find({ student: req.params.personId })
				.populate([{ path: 'teacher', select: ['first_name', 'last_name'] }, , { path: 'course', select: ['name', 'description'] }]);
		}
		else {
			return res.status(400).json({ message: '¡Rol de la persona inválido!' });
		}

		if (!perspectives) {
			return res.status(404).json({ message: '¡No se encontro ninguna perspectiva!' });
		}

		if (perspectives.length <= 0) {
			return res.status(200).json({ message: '¡Perspectivas no encontrada!' });
		}

		return res.status(200).json({ message: 'Perspectivas obtenidas exitosamente', perspectives });

	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
};

export const getPerspectiveByCourseStudentTeacher = async (req, res) => {
	try {
		const { courseId, teacherId, studentId } = req.params;

		const perspectives = await Perspective.find({ course: courseId, teacher: teacherId, student: studentId })
			.populate([{ path: 'student', select: ['first_name', 'last_name'] }, { path: 'teacher', select: ['first_name', 'last_name'] }, , { path: 'course', select: ['name', 'description'] }]);

		if (!perspectives) {
			return res.status(404).json({ message: '¡No se encontro ninguna perspectiva!' });
		}

		if (perspectives.length <= 0) {
			return res.status(200).json({ message: '¡No se encontro ninguna perspectiva!' });
		}

		return res.status(200).json({ message: 'Perspectivas obtenidas exitosamente', perspectives });

	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
};
