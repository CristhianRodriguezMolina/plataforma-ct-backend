import jwt from 'jsonwebtoken';
import config from '../config';

//import Person from '../models/Person';

//METODO PARA VERIFICAR SI EXISTE UN TOKEN Y 
export const verifyToken = async(req, res, next) => {

    let token = req.headers['x-access-token'];

    //Con el retorno se acaba la ejecución del metodo, 
    //no es para retornar la respuesta, ella retorna solo con res
    if (!token) return res.status(403).json({ message: 'No token provided' });

    try {
        const tokenDecoded = jwt.verify(token, config.SECRET);
        req.userId = tokenDecoded.id;

        //const user = await Person.findById(req.userId);
        //if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        next(); //Si todo esta correcto continua al siguiente metodo
    } catch (error) {
        return res.status(401).json({ message: 'No autorizado' });
    }
}