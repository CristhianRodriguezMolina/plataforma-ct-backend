//DB Schema imports
import Course from '../models/Course';
import CourseStudent from '../models/CourseStudent';
import Person from '../models/Person';

export const getMyCourses = async (req, res) => {
	try {
		const courses = await Course.find({ creator: req.params.id }, null, { sort: { name: 1 } });
		return res.status(200).json({ message: 'Cursos hallados con exito', courses });
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error obteniendo los cursos ${error}` });
	}
}

export const getCourseById = async (req, res) => {
	try {
		const course = await Course.findById(req.params.id);

		if (!course) {
			return res.status(404).json({ message: `Curso no encontrado o inexistente!` });
		}

		return res.status(200).json({ message: 'Curso hallado con exito', course });
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error obteniendo los curso ${error}` });
	}
}

export const createCourse = async (req, res) => {
	try {
		const { name, description, topic, creator, visible } = req.body;
		const newCourse = new Course({ name, description, topic, creator, visible });

		const savedCourse = await newCourse.save();

		return res.status(201).json({ message: 'Curso creado satisfactoriamente', course: savedCourse })
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error creando el curso ${error}` });
	}
}

export const createUnit = async (req, res) => {
	try {
		const { name, description } = req.body;

		if (!name || !description) {
			return res.status(400).json({ message: 'Campos requeridos para agregar unidad' })
		}

		const course = await Course.findById(req.params.id);

		if (!course) {
			return res.status(404).json({ message: 'Curso no encontrado o inexistente' })
		}

		course.units.push({ name, description });

		const updatedCourse = await course.save();

		return res.status(201).json({ message: 'Curso actualizado satisfactoriamente', updatedCourse })
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error actualizando el curso ${error}` });
	}
}

export const deleteCourse = async (req, res) => {
	try {
		const deletedCourse = await Course.findByIdAndDelete(req.params.id);

		if (!deletedCourse) {
			return res.status(400).json({ message: 'Curso no encontrado' });
		}

		return res.status(200).json({ message: `El curso fue borrado con exito`, deletedCourse })
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error borrando el curso "${deleteCourse.name}" por el error ${error}` })
	}
}

export const deleteUnit = async (req, res) => {
	try {
		const course = await Course.findById(req.params.courseId);

		if (!course) {
			return res.status(400).json({ message: 'Curso no encontrado' });
		}

		if (!course) {
			return res.status(404).json({ message: 'Curso no encontrado' });
		}

		const unitToDelete = course.units.id(req.params.unitId);

		if (!unitToDelete) {
			return res.status(404).json({ message: 'Unidad no encontrada' });
		}

		unitToDelete.remove();

		const updatedCourse = await course.save()

		return res.status(200).json({ message: `La unidad fue borrada con exito`, updatedCourse })
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error borrando una unidad del curso "${deletedUnit.name}" por el error ${error}` })
	}
}

export const updateUnit = (req, res) => {

	try {

		const { unit } = req.body;

		if (!unit.name) {
			return res.status(400).json({ message: "Field(s) required!" });
		}

		let tempName = unit.name.trim();

		if (tempName.localeCompare("") == 0) {
			return res.status(400).json({ message: "Field(s) required!" });
		}
		Course.findOneAndUpdate({
			"_id": req.params.courseId,
			"units._id": req.params.unitId
		}, {
			"$set": {
				"units.$": unit
			}
		}, {
			new: true
		}, (err, result) => {
			if (err) {
				return res.status(500).json({ message: "An error has ocurred when we trying to update the unit", error: err })
			}
			if (result) {
				return res.status(201).json({ message: "The unit has been updated satisfatorily", updatedCourse: result })
			} else {
				return res.status(400).json({ message: "unit not found" });
			}
		}
		);
	}
	catch (error) {
		console.log(error);
		return res.status(500).json({ message: "An error has ocurred when we trying to update a unit" });
	}
}

export const updateCourseById = async (req, res) => {
	try {
		const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });

		if (!updatedCourse) {
			return res.status(404).json({ message: 'Curso no encontrado' });
		}

		return res.status(201).json({ updatedCourse, message: `El curso fue actualizado con exito` })
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error actualizando un curso: "${error}"` })
	}
}

export const addStudents = (req, res) => {
	try {
		const { students } = req.body;
		if (students) {
			Course.findById(req.params.id, (err, course) => {
				if (err) return res.status(500).json({ message: "Hubo un error en el servidor, por favor intentelo de nuevo mas tarde" });
				if (course) {
					let courseStudents = [];
					let deniedStudents = [];

					let promises = [];

					students.map(async (student) => {

						promises.push(verifyStudent(student));

					});

					//Promise for verify if a student 
					const verifyStudent = (student) => {
						return new Promise(async (resolve, reject) => {
							try {
								const studentExists = await Person.exists({ _id: student._id, role: "student" });
								if (studentExists) {
									const cSExists = await CourseStudent.exists({ course: req.params.id, student: student._id });
									if (!cSExists) {
										console.log('adding');
										// courseStudents.push(new CourseStudent({ course: req.params.id, student: student._id }));
										console.log('courseStudents');
										console.log(courseStudents);
										courseStudents.push(new CourseStudent({ course: req.params.id, student: student._id }));
										resolve();
									}
									else {
										console.log('the student is already in the course');
										deniedStudents.push(student._id);
										resolve();
									}
								}
								else {
									console.log('the student doesn\'t exist');
									deniedStudents.push(student._id);
									resolve();
								}
							}
							catch (e) {
								console.log(e);
								console.log('error in add students (course.controller.js)');
								reject(e);
							}

						});
					}

					Promise.all(promises)
						.then(responses => {
							CourseStudent.insertMany(courseStudents, (error, docs) => {
								if (error) return res.status(500).json({ message: "No se han podido añadir los estudiantes al curso" });
								return res.status(201).json({ message: "Estudiantes añadidos al curso satisfactoriamente", acceptedStudents: docs, deniedStudents });
							});
						})
						.catch(e => {
							console.log(e);
							console.log('error in add students (course.controller.js)');
							return res.status(500).json({ message: "No se han podido añadir los estudiantes al curso" });
						});
				}
				else {
					return res.status(400).json({ message: "Curso no encontrado" });
				}
			});
		} else {
			return res.status(400).json({ message: "Los estudiantes no fueron encontrados" });
		}

	} catch (error) {
		console.log('Error found in addStudents (course.controller)');
		console.log(error);
		return res.status(500).json({ message: "Hubo un error añadiendo estudiantes al curso" });
	}
}