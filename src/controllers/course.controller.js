//DB Schema imports
import Course from '../models/Course';

export const getMyCourses = async(req, res) => {
    try {
        const courses = await Course.find({ creator: req.params.id }, null, { sort: { name: 1 } });
        res.status(200).json({ message: 'Cursos hallados con exito', courses });
    } catch (error) {
        res.status(400).json({ message: `Hubo un error obteniendo los cursos ${error}` });
    }
}

export const getCoursesById = async(req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        console.log(course)
        if (!course) {
            res.status(404).json({ message: `Curso (${req.params.id}) no encontrado o inexistente!` });
        }

        res.status(200).json({ message: 'Curso hallado con exito', course });
    } catch (error) {
        res.status(400).json({ message: `Hubo un error obteniendo los curso ${error}` });
    }
}

export const createCourse = async(req, res) => {
    try {
        const { name, description, topic, creator, visible } = req.body;
        const newCourse = new Course({ name, description, topic, creator, visible });
        console.log(newCourse)

        const savedCourse = await newCourse.save();

        res.status(200).json({ message: 'Curso creado satisfactoriamente', course: savedCourse })
    } catch (error) {
        res.status(400).json({ message: `Hubo un error creando el curso ${error}` });
    }
}

export const deleteCourse = async(req, res) => {
    try{        
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: `El curso "${deleteCourse.name}" fue borrado con exito`, deletedCourse })
    }catch(error){
        res.status(400).json({ message: `Hubo un error borrando el curso "${deleteCourse.name}" por el error ${error}` })
    }
}

export const updateCourseById = async(req, res) => {
    try{
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        res.status(201).json({ updatedCourse, message: `El curso "${updatedCourse.name}" fue actualizado con exito` })
    }catch(error){
        res.status(400).json({ message: `Hubo un error actualizando un curso: "${error}"` })
    }
}