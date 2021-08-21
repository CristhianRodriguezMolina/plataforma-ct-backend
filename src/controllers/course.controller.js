//DB Schema imports
import Course from '../models/Course';
import CourseStudent from '../models/CourseStudent';
import Person from '../models/Person';
import Activity from '../models/Activity';
import TaskActivity from '../models/TaskActivity';
import StudentActivity from '../models/StudentActivity';

export const getMyCourses = async (req, res) => {
	try {
		const courses = await Course.find({ creator: req.params.id }, null, { sort: { name: 1 } });
		return res.status(200).json({ message: 'Cursos hallados con exito', courses });
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error obteniendo los cursos` });
	}
}

export const getMyStudentCourses = async (req, res) => {
	try {
		var courseStudents = await CourseStudent.find({ student: req.params.id }).select('course -_id'); // To get just the courses id

		// Convert the object array to a array just of _id's of the courses
		courseStudents = Array.from(courseStudents, courseStudent => courseStudent.course);

		if (courseStudents.length <= 0) {
			return res.status(200).json({ message: 'No esta inscrito en ningun curso' });
		}

		// Get the courses that are in the array of _id's
		const courses = await Course.find({ _id: { $in: courseStudents } });

		return res.status(200).json({ message: "Cursos obtenidos satisfactoriamente", courses });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Hubo un error obteniendo los cursos de un estudiante" });
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
		return res.status(500).json({ message: `Hubo un error obteniendo los curso` });
	}
}

export const getTeacherCourse = async (req, res) => {
	try {
		const teacher = await Person.findById(req.params.id);

		if (!teacher) {
			return res.status(404).json({ message: `Profesor no encontrado o inexistente!` });
		}

		return res.status(200).json({ message: 'Profesor hallado con exito', teacher });
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error obteniendo el profesor de un curso` });
	}
}

export const createCourse = async (req, res) => {
	try {
		const { name, description, topic, creator, visible } = req.body;
		const newCourse = new Course({ name, description, topic, creator, visible });

		const savedCourse = await newCourse.save();

		return res.status(201).json({ message: 'Curso creado satisfactoriamente', course: savedCourse })
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error creando el curso` });
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
		return res.status(500).json({ message: `Hubo un error actualizando el curso` });
	}
}

export const deleteCourse = async (req, res) => {
	try {
		const deletedCourse = await Course.findByIdAndDelete(req.params.id);

		if (!deletedCourse) {
			return res.status(400).json({ message: 'Curso no encontrado' });
		}

		await TaskActivity.deleteMany({ course: req.params.id }); //Se borran las entidades TaksActivity en caso de que se borre el curso asociado

		await StudentActivity.deleteMany({ course: req.params.id }); //Se borran las entidades StudentActivity en caso de que se borre el curso asociado

		await CourseStudent.deleteMany({ course: req.params.id }); //Se borran las entidades CourseStudent en caso de que se borre el curso asociado

		return res.status(200).json({ message: `El curso fue borrado con exito`, deletedCourse })
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error borrando el curso "${deleteCourse.name}"` })
	}
}

export const deleteUnit = async (req, res) => {
	try {
		const course = await Course.findById(req.params.courseId);

		if (!course) {
			return res.status(400).json({ message: 'Curso no encontrado' });
		}

		const unitToDelete = course.units.id(req.params.unitId);

		if (!unitToDelete) {
			return res.status(404).json({ message: 'Unidad no encontrada' });
		}

		unitToDelete.remove();

		await TaskActivity.deleteMany({ unit: req.params.unitId }); //Se borran las entidades TaksActivity en caso de que se borre la unidad asociada

		await StudentActivity.deleteMany({ unit: req.params.unitId }); //Se borran las entidades StudentActivity en caso de que se borre el curso asociado

		const updatedCourse = await course.save();

		return res.status(200).json({ message: `La unidad fue borrada con exito`, updatedCourse });
	} catch (error) {
		return res.status(500).json({ message: `Hubo un error borrando una unidad del curso "${deletedUnit.name}` });
	}
}

export const updateUnit = (req, res) => {

	try {

		const { unit } = req.body;

		if (!unit.name) {
			return res.status(400).json({ message: "Campos requeridos!" });
		}

		let tempName = unit.name.trim();

		if (tempName.localeCompare("") == 0) {
			return res.status(400).json({ message: "Campos requeridos!" });
		}
		Course.findOneAndUpdate({
			"_id": req.params.courseId,
			"units._id": req.params.unitId
		}, {
			"$set": {
				"units.$.name": unit.name,
				"units.$.description": unit.description,
				"units.$.visible": unit.visible,
				"units.$.is_due_date": unit.is_due_date,
				"units.$.due_date": unit.due_date
			}
		}, {
			new: true
		}, (err, result) => {
			if (err) {
				return res.status(500).json({ message: "Ha ocurrido un error cuando se actualizaba una unidad", error: err })
			}
			if (result) {
				return res.status(201).json({ message: "La unidad ha sido actualizada satisfactoriamente", updatedCourse: result })
			} else {
				return res.status(404).json({ message: "Unidad no encontrada" });
			}
		});
	}
	catch (error) {
		console.log('error in updateUnit (course.controller)');
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
		return res.status(500).json({ message: "Hubo un error actualizando un curso" })
	}
}

export const getStudents = async (req, res) => {
	try {
		var courseStudents = await CourseStudent.find({ course: req.params.id }).select('student -_id'); // To get just the students id

		// Convert the object array to a array just of _id's of the students
		courseStudents = Array.from(courseStudents, courseStudent => courseStudent.student);

		if (courseStudents.length <= 0) {
			return res.status(200).json({ message: 'No hay estudiantes en el curso' });
		}

		// Get the students that are in the array of _id's
		const students = await Person.find({ _id: { $in: courseStudents } });

		return res.status(200).json({ message: "Estudiantes obtenidos satisfactoriamente", students });
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Hubo un error obteniendo estudiantes del curso" });
	}
}

export const getStudentsNotInCourse = async (req, res) => {
	try {
		var courseStudents = await CourseStudent.find({ course: req.params.id }).select('student -_id'); // To get just the students id

		// Convert the object array to a array just of _id's
		courseStudents = Array.from(courseStudents, courseStudent => courseStudent.student);

		if (courseStudents.length <= 0) {
			// In case that the course doesn't have students, just get all the students
			const students = await Person.find({ role: 'student' });

			return res.status(200).json({ message: "Estudiantes obtenidos satisfactoriamente", students });
		}

		// Get the students that are not in the array of _id's
		const students = await Person.find({ _id: { $nin: courseStudents }, role: "student" });

		return res.status(200).json({ message: "Estudiantes obtenidos satisfactoriamente", students });
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Hubo un error obteniendo estudiantes del curso" });
	}
}

export const getActivities = async (req, res) => {
	try {
		var taskActivities = await TaskActivity.find({ task: req.params.id }).select('activity -_id').sort({ position: 1 }); // To get just the activities id //Sort (1: asc, -1: desc)

		// Convert the object array to a array just of _id's
		taskActivities = Array.from(taskActivities, taskActivity => taskActivity.activity);

		if (taskActivities.length <= 0) {
			return res.status(200).json({ message: 'No hay actividades en la tarea' });
		}

		// Get the activities that are in the array of _id's
		const unsortedActivities = await Activity.find({ _id: { $in: taskActivities } });

		var sortedActivities = [];
		for (let i = 0; i < taskActivities.length; i++) {
			sortedActivities.push(unsortedActivities.filter((activity) => activity._id.equals(taskActivities[i]))[0]);
		}

		return res.status(200).json({ message: "Actividades obtenidas satisfactoriamente", activities: sortedActivities });
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Hubo un error obteniendo las actividades de la tarea" });
	}
}

export const getActivitiesNotInTask = async (req, res) => {
	try {
		var taskActivities = await TaskActivity.find({ task: req.params.id }).select('activity -_id'); // To get just the activities id

		// Convert the object array to a array just of _id's
		taskActivities = Array.from(taskActivities, taskActivity => taskActivity.activity);

		if (taskActivities.length <= 0) {
			// In case that the task doesn't have activities, just get all the activities
			const activities = await Activity.find({});

			// Get just the verified activities
			const verfiedActivities = activities.filter(activity => activity.verified === true);

			return res.status(200).json({ message: "Actividades obtenidas satisfactoriamente", activities: verfiedActivities });
		}

		// Get the activities that are not in the array of _id's
		const activities = await Activity.find({ _id: { $nin: taskActivities } });

		// Get just the verified activities
		const verfiedActivities = activities.map(activity => activity.verified === true);

		return res.status(200).json({ message: "Actividades obtenidas satisfactoriamente", activities: verfiedActivities });
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Hubo un error obteniendo actividades de la tarea" });
	}
}

export const addStudentsByCourseId = (req, res) => {
	try {
		const { students } = req.body;
		if (students) {
			Course.findById(req.params.id, (err, course) => {
				if (err) return res.status(500).json({ message: "Hubo un error en el servidor, por favor intentelo de nuevo mas tarde" });
				if (course) {
					let courseStudents = [];
					let deniedStudents = [];

					let promises = [];

					//Promise for verify if a student exists
					const verifyStudent = (student) => {
						return new Promise(async (resolve, reject) => {
							try {
								const studentExists = await Person.exists({ _id: student._id, role: "student" });
								if (studentExists) {
									const cSExists = await CourseStudent.exists({ course: req.params.id, student: student._id });
									if (!cSExists) {
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
									console.log(`the student doesn\'t exist. Student ID: ${student._id}`);
									deniedStudents.push(student._id);
									resolve();
								}
							}
							catch (e) {
								console.log(e);
								console.log('error in addStudentsByCourseId (course.controller.js)');
								reject(e);
							}

						});
					}

					students.map(async (student) => {

						promises.push(verifyStudent(student));

					});

					Promise.all(promises)
						.then(responses => {
							CourseStudent.insertMany(courseStudents, async (error, docs) => {
								if (error) return res.status(500).json({ message: "No se han podido añadir los estudiantes al curso" });
								course.students += courseStudents.length;
								await course.save();
								return res.status(201).json({ message: "Estudiantes añadidos al curso satisfactoriamente", acceptedStudents: docs, deniedStudents });
							});
						})
						.catch(e => {
							console.log(e);
							console.log('error in addStudentsByCourseId (course.controller.js)');
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
		console.log('Error found in addStudentsByCourseId (course.controller)');
		console.log(error);
		return res.status(500).json({ message: "Hubo un error añadiendo estudiantes al curso" });
	}
};

export const removeStudentsByCourseId = async (req, res) => {
	try {
		CourseStudent.findOneAndDelete({ course: req.params.courseId, student: req.params.studentId }, (err, courseStudent) => {
			if (err) return res.status(500).json({ message: "Hubo un error en el servidor, por favor intentelo de nuevo mas tarde" });
			if (courseStudent) {
				Course.findById(req.params.courseId, async (err, course) => {
					if (err) console.log(error);
					course.students -= 1;
					await course.save();

					await StudentActivity.deleteMany({ course: req.params.courseId, student: req.params.studentId }); //Se borran las entidades StudentActivity en caso de que se borre el estudiante asociado del curso asociado

					return res.status(201).json({ message: "Estudiante eliminado satisfactoriamente" });
				});
			}
			else {
				return res.status(400).json({ message: "Curso o estudiante no encontrado" });
			}
		});
	} catch (error) {
		console.log('Error found in removeStudentsByCourseId (course.controller)');
		console.log(error);
		return res.status(500).json({ message: "Hubo un error eliminando estudiantes del curso" });
	}
};

export const createTask = (req, res) => {
	try {
		const { name, description, activities } = req.body;

		if (!name) {
			return res.status(400).json({ message: 'El nombre de la tarea es requerido' });
		}

		let tempName = name;

		if (tempName.trim().localeCompare('') == 0) {
			return res.status(400).json({ message: 'El nombre de la tarea es requerido' });
		}

		let task = { name, description };

		Course.findOneAndUpdate({
			"_id": req.params.courseId,
			"units._id": req.params.unitId
		}, {
			"$push": {
				"units.$.tasks": task
			}
		}, {
			new: true
		}, (err, result) => {
			if (err) {
				return res.status(500).json({ message: "An error has ocurred when we trying to create the task" })
			}
			if (result) {
				let unit = result.units.filter((unit) => unit._id.equals(req.params.unitId))[0];
				let task = unit.tasks[unit.tasks.length - 1];
				return res.status(201).json({ message: "The task has been created satisfatorily", task })
			} else {
				return res.status(404).json({ message: "course or unit not found" });
			}
		});
	} catch (e) {
		console.log('e');
		console.log(e);
		return res.status(500).json({ message: "Ha ocurrido un error inexperado, por favor intentelo mas tarde" });
	};
};

export const sortTaskActivities = async (req, res) => {
	const { activities } = req.body;

	for (let i = 0; i < activities.length; i++) {
		try {
			var result = await TaskActivity.updateOne({ task: req.params.taskId, activity: activities[i]._id }, { $set: { position: i } });
			console.log(result);
		}
		catch {
			return res.status(500).json({ message: "Unexpected error, try again later" })
		}
	}

	return res.status(201).json({ message: "list updated satisfactorily" });
}

export const addActivitiesToTask = async (req, res) => {
	try {
		const { activities } = req.body;
		if (!activities) {
			return res.status(400).json({ message: "Las actividades no fueron encontradas" });
		}

		const taskActivitiesNumber = await TaskActivity.countDocuments({ task: req.params.taskId });



		Course.findOne({ "units.tasks._id": req.params.taskId }, (err, course) => {
			if (err) {
				console.log('err');
				console.log(err);
				return res.status(500).json({ message: "Hubo un error en el servidor, por favor intentelo de nuevo mas tarde" });
			}
			if (!course) return res.status(400).json({ message: "Tarea no encontrada" });

			let taskActivities = [];
			let deniedActivities = [];

			let promises = [];


			//Promise for verify it an activity exists 
			const verifyActivity = (activity, index) => {
				return new Promise(async (resolve, reject) => {
					try {
						const activityExists = await Activity.exists({ _id: activity._id });
						if (activityExists) {
							const tAExists = await TaskActivity.exists({ task: req.params.taskId, unit: req.params.unitId, activity: activity._id, course: course._id });
							if (!tAExists) {

								taskActivities.push(new TaskActivity({ task: req.params.taskId, unit: req.params.unitId, activity: activity._id, course: course._id, position: taskActivitiesNumber + index }));

								resolve();
							}
							else {
								console.log('the activity is already in the task');
								deniedActivities.push(activity._id);
								resolve();
							}
						}
						else {
							console.log(`the activity doesn\'t exist. Student ID: ${activity._id}`);
							deniedActivities.push(activity._id);
							resolve();
						}
					}
					catch (e) {
						console.log(e);
						console.log('error in AddActivitiesToTask (course.controller.js)');
						reject(e);
					}

				});
			}

			activities.map(async (activity, index) => {

				promises.push(verifyActivity(activity, index));

			});

			Promise.all(promises)
				.then(responses => {
					TaskActivity.insertMany(taskActivities, (error, docs) => {
						if (error) {
							console.log('error');
							console.log(error);
							return res.status(500).json({ message: "No se han podido añadir las actividades a la tarea" });
						}
						return res.status(201).json({ message: "Actividades añadidas al curso satisfactoriamente", acceptedActivities: docs, deniedActivities });
					});
				})
				.catch(e => {
					console.log(e);
					console.log('error in addActivitiesToTask (course.controller.js)');
					return res.status(500).json({ message: "No se han podido añadir las actividades a la tarea" });
				});

		});

	} catch (error) {
		console.log('Error found in addActivitiesToTask (course.controller)');
		console.log(error);
		return res.status(500).json({ message: "Ha ocurrido un error añadiendo estudiantes al curso" });
	}
};


export const updateTask = (req, res) => {
	try {
		const { name, description, visible, is_due_date, due_date } = req.body;

		if (!name) {
			return res.status(400).json({ message: 'El nombre de la tarea es requerido' });
		}

		let tempName = name;

		if (tempName.trim().localeCompare('') == 0) {
			return res.status(400).json({ message: 'El nombre de la tarea es requerido' });
		}

		Course.findOneAndUpdate({
			"_id": req.params.courseId
		}, {
			"$set": {
				"units.$[i].tasks.$[j].name": name,
				"units.$[i].tasks.$[j].description": description,
				"units.$[i].tasks.$[j].visible": visible,
				"units.$[i].tasks.$[j].is_due_date": is_due_date,
				"units.$[i].tasks.$[j].due_date": due_date

			}
		}, {
			new: true,
			arrayFilters: [{
				"i._id": req.params.unitId
			}, {
				"j._id": req.params.taskId
			}]
		}, (err, result) => {
			if (err) {
				return res.status(500).json({ message: "An error has ocurred when we trying to update the task" })
			}
			if (result) {
				let unit = result.units.filter((unit) => unit._id.equals(req.params.unitId))[0];
				let task = unit.tasks.filter((task) => task._id.equals(req.params.taskId))[0];
				return res.status(201).json({ message: "The task has been updated satisfatorily", task })
			} else {
				return res.status(404).json({ message: "Course, unit or task not found" });
			}
		});

	} catch (e) {
		console.log('e');
		console.log(e);
		return res.status(500).json({ message: "Ha ocurrido un error inesperado, por favor intentelo mas tarde" });
	};
};

export const deleteTask = (req, res) => {
	try {
		Course.findById(req.params.courseId, async (err, course) => {
			if (err) {
				console.log('err');
				console.log(err);
				return res.status(500).json({ message: "An error has ocurred when we trying to delete the task" })
			}
			if (course) {
				const unit = course.units.id(req.params.unitId);
				if (!unit) {
					return res.status(404).json({ message: "Unit not found" });
				}

				const taskToDelete = unit.tasks.id(req.params.taskId);

				if (!taskToDelete) {
					return res.status(404).json({ message: 'Tarea no encontrada' });
				}

				taskToDelete.remove();

				const updatedCourse = await course.save();

				await TaskActivity.deleteMany({ task: req.params.taskId }); //Se borran las entidades TaksActivity en caso de que se borre la tarea asociada

				await StudentActivity.deleteMany({ task: req.params.taskId }); //Se borran las entidades StudentActivity en caso de que se borre la tarea asociada

				return res.status(201).json({ message: "The task has been deleted satisfatorily", updatedCourse })
			} else {
				return res.status(404).json({ message: "Course not found" });
			}
		});
	} catch (e) {
		console.log('e');
		console.log(e);
		return res.status(500).json({ message: "Ha ocurrido un error inesperado, por favor intentelo mas tarde" });
	};
};

export const removeActvitiesFromTask = async (req, res) => {
	try {
		TaskActivity.findOneAndDelete({ task: req.params.taskId, activity: req.params.activityId }, (err, taskActivity) => {
			if (err) return res.status(500).json({ message: "Hubo un error en el servidor, por favor intentelo de nuevo mas tarde" });
			if (taskActivity) {
				return res.status(201).json({ message: "Actividad eliminada satisfactoriamente" });
			}
			else {
				return res.status(400).json({ message: "Tarea o actividad no encontrada" });
			}
		});
	} catch (error) {
		console.log('Error found in removeActvitiesFromTask (course.controller)');
		console.log(error);
		return res.status(500).json({ message: "Hubo un error eliminando actividades de la tarea" });
	}
};

export const getTask = (req, res) => {
	try {
		Course.findById(req.params.courseId, async (err, course) => {
			if (err) {
				console.log('err');
				console.log(err);
				return res.status(500).json({ message: "An error has ocurred when we trying to get the task" })
			}
			if (course) {
				const unit = course.units.id(req.params.unitId);
				if (!unit) {
					return res.status(404).json({ message: "Unit not found" });
				}

				const task = unit.tasks.id(req.params.taskId);

				if (!task) {
					return res.status(404).json({ message: 'Tarea no encontrada' });
				}

				return res.status(200).json({ message: "Task obtained successfully", task });
			} else {
				return res.status(404).json({ message: "Course not found" });
			}
		});
	} catch (e) {
		console.log('e');
		console.log(e);
		return res.status(500).json({ message: "Ha ocurrido un error inesperado, por favor intentelo mas tarde" });
	}
}

export const getAllActivitiesInCourse = (req, res) => {
	try {
		TaskActivity.find({ course: req.params.courseId }, (err, activities) => {
			if (err) {
				console.log('err');
				console.log(err);
				return res.status(500).json({ message: "An error has ocurred when we trying to get the task" })
			}
			if (!activities) return res.status(404).json({ message: "Activities not found" });
			return res.status(200).json({ message: "Actividades obtenidas satisfactoriamente", activities });
		});
	} catch (e) {
		console.log('e');
		console.log(e);
		return res.status(500).json({ message: "Ha ocurrido un error inesperado, por favor intentelo mas tarde" });
	}
}

export const getLastActivityToContinue = async (req, res) => {
	try {
		var lastActivityInfo;
		var lastTask;
		var lastActivity;
		var pos = -1;



		const course = await Course.findById({ _id: req.params.courseId });

		let isThereLastActivity = false;
		if (!course) return res.status(404).json({ message: "No se pudo encontrar la información" });

		let tasks = course.units.id(req.params.unitId).tasks;


		for (let i = 0; i < tasks.length && !isThereLastActivity; i++) {
			if (tasks[i].visible) {

				const taskActivities = await TaskActivity.find({ task: tasks[i]._id }).sort({ position: 1 });

				for (let j = 0; j < taskActivities.length && !isThereLastActivity; j++) {
					const studentActivity = await StudentActivity.findOne({ student: req.params.studentId, task: tasks[i]._id, activity: taskActivities[j].activity });
					if (studentActivity) {
						if (!studentActivity.complete) {
							isThereLastActivity = true;
							lastTask = tasks[i];
							lastActivity = await Activity.findById({ _id: taskActivities[j].activity });
							pos = taskActivities[j].position;
						}
					}
					else {
						isThereLastActivity = true;
						lastTask = tasks[i];
						lastActivity = await Activity.findById({ _id: taskActivities[j].activity });
						pos = taskActivities[j].position;
					}
				}
			}
		}

		if (isThereLastActivity && lastTask && lastActivity) {
			lastActivityInfo = {
				activityType: lastActivity.type,
				taskId: lastTask._id,
				taskName: lastTask.name,
				taskDes: lastTask.description,
				activityId: lastActivity._id,
				activityName: lastActivity.name,
				activityDes: lastActivity.description,
				activityPos: pos
			}

			return res.status(200).json({ message: 'Ultima actividad obtenida satisfactoriamente', success: true, lastActivityInfo });
		}
		return res.status(200).json({ message: 'No se pudo encontrar la ultima actividad', success: false });
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: 'Ha ocurrido un error inesperado, por favor intentelo mas tarde' })
	}
};

export const getStudentIndividualProgress = async (req, res) => {
	try {

		const student = await Person.findById(req.params.studentId);
		const studentActivities = await StudentActivity.find({ student: req.params.studentId, course: req.params.courseId });
		const course = await Course.findById(req.params.courseId);
		const tasksActivities = await TaskActivity.find({ course: req.params.courseId }).populate("activity");

		return res.status(200).json({ message: 'Información del progreso del studiante obtenida satisfactoriamente', studentActivities, course, tasksActivities, student });
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: 'Ha ocurrido un error inesperado, por favor intentelo mas tarde' })
	}
};
