import Person from '../models/Person';

//METODO QUE VERIFICA SI LOS ROLES RECIBIDOS EN EL req.body EXISTEN
export const checkRoleExisted = (req, res, next) => {
    const role = req.body.role;
    if (role) {        
        const ROLES = ['admin', 'teacher', 'student'];
        if (!ROLES.includes(role)) {
            return res.status(400).json({ message: `El role ${role} no existe` });
        }        
    }
    next(); //Si todo esta correcto continua al siguiente metodo
}

//METODO QUE VERIFICA SI LOS CAMPOS RECIBIDOS EN EL req.body SON VALIDOS PARA UN REGISTRO
export const verifyFields = async(req, res, next) => {
    const { first_name, last_name, age, genre, id, password, confirm_password } = req.body;
    const errors = [];

    if (!first_name || first_name.length <= 0) {
        errors.push({ message: 'Por favor, ingrese el nombre' });
    }

    if (!last_name || last_name.length <= 0) {
        errors.push({ message: 'Por favor, ingrese el apellido' });
    }

    if (!age || age.length <= 0) {
        errors.push({ message: 'Por favor, ingrese la edad' });
    }

    if (!genre || genre.length <= 0) {
        errors.push({ message: 'Por favor, ingrese el genero' });
    }

    if(password && confirm_password){
        if (password.localeCompare(confirm_password)) {
            errors.push({ message: 'Las contraseñas no coinciden' });
        }
    }
    else{
        errors.push({ message: 'Por favor, ingrese la contraseña' });
    }

    if (!id || id.length <= 0) {
        errors.push({ message: 'Por favor, ingrese el numero de identificación' });
    }

    if (!password || password.length < 4) {
        errors.push({ message: 'La contraseña debe tener al menos 4 caracteres' });
    }

    if (errors.length > 0) {
        console.log(errors);
        return res.status(200).json(errors);
    } else {
        try {
            const idUser = await Person.findOne({ id: id });
            if (idUser) {
                console.log('El usuario ya existe!')
                return res.json({ message: 'El usuario ya existe!' });
            }            
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
    next(); //Si todo esta correcto continua al siguiente metodo
}