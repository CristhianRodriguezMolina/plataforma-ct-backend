import jwt from 'jsonwebtoken';
import config from '../config';

import Person from '../models/Person';

//METODO PARA VERIFICAR SI EXISTE UN TOKEN Y 
export const verifyToken = async(req, res, next) => {

    let token = req.headers['x-access-token'];

    //Con el retorno se acaba la ejecución del metodo, 
    //no es para retornar la respuesta, ella retorna solo con res
    if (!token) return res.status(403).json({ message: 'No token provided' });

    try {
        const tokenDecoded = jwt.verify(token, config.SECRET);
        req.userId = tokenDecoded.id;

        const user = await Person.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        next(); //Si todo esta correcto continua al siguiente metodo
    } catch (error) {
        return res.status(401).json({ message: 'No autorizado' });
    }
}

//METODO PARA VERIFICAR SI UN USUARIO TIENE EL ROL DE "teacher"
export const isTeacher = async(req, res, next) => {
    try {
        const user = await Person.findById(req.userId);

        if (user.role === "teacher") {
            next(); //Si todo esta correcto continua al siguiente metodo
            return;
        }

        return res.status(403).json({ message: 'Solo autorizado para profesores' });
    } catch (error) {
        return res.status(500).send({ message: `isTeacher: ${error}` });
    }
}

//METODO PARA VERIFICAR SI UN USUARIO TIENE EL ROL DE "admin"
export const isStudent = async(req, res, next) => {
    try {
        const user = await Person.findById(req.userId);

        if (user.role === "student") {
            next(); //Si todo esta correcto continua al siguiente metodo
            return;
        }

        return res.status(403).json({ message: 'Solo autorizado para estudiantes' });
    } catch (error) {
        return res.status(500).send({ message: `isStudent: ${error}` });
    }
}

//METODO PARA VERIFICAR SI UN USUARIO TIENE EL ROL DE "admin"
export const isAdmin = async(req, res, next) => {
    try {
        const user = await Person.findById(req.userId);

        if (user.role === "admin") {
            next(); //Si todo esta correcto continua al siguiente metodo
            return;
        }

        return res.status(403).json({ message: 'Solo autorizado para administrador' });
    } catch (error) {
        return res.status(500).send({ message: `isAdmin: ${error}` });
    }
}

//METODO PARA VERIFICAR SI UN USUARIO TIENE EL ROL DE "admin" o de "teacher"
export const isAdminOrTeacher = async(req, res, next) => {
    try {
        const user = await Person.findById(req.userId);

        if (user.role === "admin" || user.role === "teacher") {
            next(); //Si todo esta correcto continua al siguiente metodo
            return;
        }

        return res.status(403).json({ message: 'Solo autorizado para administrador' });
    } catch (error) {
        return res.status(500).send({ message: `isAdmin: ${error}` });
    }
}

//METODO PARA VERIFICAR SI UN USUARIO ESTA "activo"
export const isActive = async(req, res, next) => {
    try {
        const user = await Person.findById(req.userId);

        if (!user.actived) {
            next(); //Si todo esta correcto continua al siguiente metodo
            return;
        }

        return res.status(403).json({ message: 'Acceso denegado!, su cuenta se encuentra desactivada' });
    } catch (error) {
        return res.status(500).send({ message: `isActived: ${error}` });
    }
}