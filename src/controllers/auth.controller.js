//DB Schema imports
import Person from '../models/Person';

// Gestor de token
import jwt from 'jsonwebtoken';
// Config file
import config from '../config';

/**
 * Metodo que procesa la solicitud de inicio de sesión del usuario
 * @param {*} req 
 * @param {*} res 
 */
export const signin = async (req, res) => {
    try {
        const { id, password } = req.body;

        //Verifica los campos recibidos
        if (!id || !password) {
            console.log("Campo(s) requerido(s)!");
            return res.status(400).json({ message: "Campo(s) requerido(s)!" })
        }

        //Verifica que el usuario exista
        const user = await Person.findOne({ id: id });
        if (!user) {
            console.log("Usuario no encontrado o inexistente!");
            return res.status(404).json({ message: "Usuario no encontrado o inexistente!" })
        }

        //Verifica que la contraseña coincida con la del usuario
        if (await Person.matchPassword(password, user.password)) {
            //Genera un token de sesion al usuario
            const token = jwt.sign({ id: user._id }, config.SECRET, {
                expiresIn: 604800 //Tiempo de caducidad: 24 hours
            });

            //Retorna los datos de inicio de sesion al cliente
            return res.status(200).json({
                message: 'Signin correcto',
                token: token,
                created_at: jwt.decode(token, config.SECRET).exp,
                user_role: user.role,
                user_id: user._id,
                user_image: user.image,
                user_name: user.first_name
            });
        } else {
            console.log("ID o contraseña incorrectos!");
            return res.status(200).json({ message: "ID o contraseña incorrectos!" })
        }
    } catch (error) {
        //Captura los errores durante el proceso
        console.log(error)
        return res.status(200).json({ message: `Error while Authenticating a User ${error}` })
    }
};
