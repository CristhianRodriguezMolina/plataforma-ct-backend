//DB Schema imports
import Person from '../models/Person';
import CourseStudent from '../models/CourseStudent';
import Course from '../models/Course';

//METODO QUE OBTIENE UN USUARIO POR SU _id
export const getUserById = async (req, res) => {
	try {
		const user = await Person.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "Usuario no encontrado o inexistente!" });
		}

		res.status(200).json({ user, message: "Usuario encontrado satisfactoriamente!" });
	} catch (error) {
		res.status(500).json({ message: "An internal error has ocurred" });
		throw Error(`Error while serching a Users by id ${error}`);
	}
};

//METODO QUE OBTIENE UN USUARIO POR SU ROLE
export const getUserByRole = async (req, res) => {
	try {
		const users = await Person.find({ role: req.params.role });

		res.status(200).json({ users, message: `Usuarios con role ${req.params.role} obtenidos satisfactoriamente` });
	} catch (error) {
		res.status(500).json({ message: `Un error interno ha ocurrido` });
		throw Error(`Error mientras se creaba un usuario: ${error}`);
	}
};

//METODO QUE ELIMINA UN USUARIO 
export const createUser = async (req, res) => {
	try {
		const { first_name, last_name, birth_date, genre, id, password, role } = req.body;

		// Creating a new person
		const newUser = new Person({ first_name, last_name, birth_date, genre, id, password, role });

		// Encrypting the password
		newUser.password = await Person.encryptPassword(newUser.password);

		// Saving the user in the DB
		const savedUser = await newUser.save();

		res.status(201).json({ savedUser, message: "Usuario creado satisfactoriamente" })
	} catch (error) {
		res.status(500).json({ message: "Un error interno ha ocurrido" });
		throw Error(`Error mientras se creaba un usuario: ${error}`);
	}
}

//RUTA QUE ACTUALIZA UN USUARIO POR SU ID
export const updateUserById = async (req, res) => {
	try {
		const updatedUser = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });

		if (!updatedUser) {
			return res.status(400).json({ message: 'Usuario no entontrado' });
		}

		res.status(201).json({ updatedUser, message: 'Usuario actualizado con exito' });
	} catch (error) {
		res.status(500).json({ message: "Un error interno ha ocurrido" });
		throw Error(`Error mientras se actualizaba un usuario: ${error}`);
	}
};

//METODO QUE ELIMINA UN USUARIO POR SU ID
export const deleteUserById = async (req, res) => {
	try {
		const deletedUser = await Person.findByIdAndDelete(req.params.id);

		if (!deletedUser) {
			return res.status(400).json({ message: 'Usuario no entontrado' });
		}

		if (deletedUser.role.localeCompare("student") === 0) {
			let courseStudents = await CourseStudent.find({ student: deletedUser._id }).select('course -_id');

			courseStudents = Array.from(courseStudents, courseStudent => courseStudent.course);

			await Course.updateMany({ _id: { $in: courseStudents } }, { $inc: { students: -1 } });

			await CourseStudent.deleteMany({ student: deletedUser._id });
		}

		res.status(200).json({ deletedUser, message: "Usuario borrado con exito" });
	} catch (error) {
		res.status(500).json({ message: "Un error interno ha ocurrido" });
		throw Error(`Error mientras se borraba un usuario: ${error}`);
	}
};