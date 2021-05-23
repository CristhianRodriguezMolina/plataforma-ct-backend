import Course from '../models/Course';

export const getMyCourses = async(req, res) => {
    try {
        const courses = await Course.find({ creator: req.params.id }, null, { sort: { name: 1 } });
        res.status(200).json({ message: 'Cursos hallados con exito', courses });
    } catch (error) {
        res.status(400).json({ message: `Hubo un error obteniendo los cursos ${error}` });
    }
}

export const createCourse = async(req, res) => {
    try {
        const { name, description, topic, creator, visible } = req.body;
        const newCourse = new Course({ name, description, topic, creator, visible });

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

export const updateCourse = async(req, res) => {
    try{
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        res.status(201).json({ course: updatedCourse, message: `El curso "${updatedCourse.name}" fue actualizado con exito` })
    }catch(error){
        res.status(400).json({ message: `Hubo un error actualizando un curso: "${error}"` })
    }
}