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
export const verifySesionFields = async (req, res, next) => {
    const { id, password, confirm_password } = req.body;

    if (password && confirm_password) {
        if (password.localeCompare(confirm_password)) {
            return res.status(200).json({ message: 'Las contraseñas no coinciden' });
        }
    }
    else {
        return res.status(200).json({ message: 'Por favor, ingrese la contraseña' });
    }

    try {
        const idUser = await Person.findOne({ id: id });
        if (!idUser) {
            console.log(`El usuario con la identificación "${id}" no existe`)
            return res.json({ message: `El usuario con la identificación "${id}" no existe` });
        }

        // Se guarda el usuario para usarlo en el metodo de "updateUserPasswordById"
        req.user = idUser;
    } catch (error) {
        res.status(500).json({ message: error });
    }

    next(); //Si todo esta correcto continua al siguiente metodo
}

//METODO QUE VERIFICA SI LOS CAMPOS RECIBIDOS EN EL req.body SON VALIDOS PARA UN REGISTRO
export const verifyFields = async (req, res, next) => {
    const { first_name, last_name, birth_date, genre, id, password, confirm_password } = req.body;
    const errors = [];

    if (!first_name || first_name.length <= 0) {
        return res.status(400).json({ message: 'Por favor, ingrese el nombre' });
    }

    if (!last_name || last_name.length <= 0) {
        return res.status(400).json({ message: 'Por favor, ingrese el apellido' });
    }

    if (!birth_date) {
        return res.status(200).json({ message: 'Por favor, ingrese la edad' });
    }

    if (!genre || genre.length <= 0 || genre === 'NA') {
        return res.status(200).json({ message: 'Por favor, ingrese el género' });
    }

    if (password && confirm_password) {
        if (password.localeCompare(confirm_password)) {
            return res.status(200).json({ message: 'Las contraseñas no coinciden' });
        }
    }
    else {
        return res.status(200).json({ message: 'Por favor, ingrese la contraseña' });
    }

    if (!id || id.length <= 0) {
        return res.status(200).json({ message: 'Por favor, ingrese el número de identificación' });
    }

    if (!password || password.length < 4) {
        return res.status(200).json({ message: 'La contraseña debe tener al menos 4 caracteres' });
    }

    if (errors.length > 0) {
        console.log(errors);
        return res.status(200).json(errors);
    } else {
        try {
            const idUser = await Person.findOne({ id: id });
            if (idUser) {
                console.log('El usuario ya existe, la identificación ya existe!')
                return res.json({ message: 'Ya hay un usuario con esta identificación!' });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
    next(); //Si todo esta correcto continua al siguiente metodo
}