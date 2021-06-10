//DB Schema imports
import Course from '../models/Course';

export const getMyCourses = async(req, res) => {
    try {
        const courses = await Course.find({ creator: req.params.id }, null, { sort: { name: 1 } });
        return res.status(200).json({ message: 'Cursos hallados con exito', courses });
    } catch (error) {
        return res.status(500).json({ message: `Hubo un error obteniendo los cursos ${error}` });
    }
}

export const getCourseById = async(req, res) => {
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

export const createCourse = async(req, res) => {
    try {
        const { name, description, topic, creator, visible } = req.body;
        const newCourse = new Course({ name, description, topic, creator, visible });

        const savedCourse = await newCourse.save();

        return res.status(201).json({ message: 'Curso creado satisfactoriamente', course: savedCourse })
    } catch (error) {
        return res.status(500).json({ message: `Hubo un error creando el curso ${error}` });
    }
}

export const createUnit = async(req, res) => {
    try {        
        const { name, description } = req.body;        

        if(!name || !description){
            return res.status(400).json({ message: 'Campos requeridos para agregar unidad' })
        }

        const course = await Course.findById(req.params.id);

        if(!course){
            return res.status(404).json({ message: 'Curso no encontrado o inexistente' })
        }

        course.units.push({name, description});

        const updatedCourse = await course.save();
        
        return res.status(201).json({ message: 'Curso actualizado satisfactoriamente', updatedCourse })
    } catch (error) {
        return res.status(500).json({ message: `Hubo un error actualizando el curso ${error}` });
    }
}

export const deleteCourse = async(req, res) => {
    try{        
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);

        if(!deletedCourse){
            return res.status(400).json({ message: 'Curso no encontrado' });            
        }      
        
        return res.status(200).json({ message: `El curso fue borrado con exito`, deletedCourse })
    }catch(error){
        return res.status(500).json({ message: `Hubo un error borrando el curso "${deleteCourse.name}" por el error ${error}` })
    }
}

export const deleteUnit = async(req, res) => {
    try{        
        const course = await Course.findById(req.params.courseId);

        if(!course){
            return res.status(404).json({ message: 'Curso no encontrado' });            
        }    
        
        const unitToDelete = course.units.id(req.params.unitId);

        if(!unitToDelete){
            return res.status(404).json({ message: 'Unidad no encontrada' });         
        }

        unitToDelete.remove();

        const updatedCourse = await course.save()
        
        return res.status(200).json({ message: `La unidad fue borrada con exito`, updatedCourse })
    }catch(error){
        return res.status(500).json({ message: `Hubo un error borrando una unidad del curso "${deletedUnit.name}" por el error ${error}` })
    }
}

export const updateCourseById = async(req, res) => {
    try{
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if(!updatedCourse){
            return res.status(404).json({ message: 'Curso no encontrado' });            
        }
        
        return res.status(201).json({ updatedCourse, message: `El curso fue actualizado con exito` })
    }catch(error){
        return res.status(500).json({ message: `Hubo un error actualizando un curso: "${error}"` })
    }
}