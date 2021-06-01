import mongoose, { Schema, model } from 'mongoose';
const bcrypt = require('bcryptjs'); //To encrypt passwords

const PersonSchema = new Schema({
    'first_name': { type: String, required: true, trim: true }, 
    'last_name': { type: String, required: true, trim: true },
    'phone': { type: String, default: "" },
    'birth_date': Date,
    'genre': String,
    'image': String,
    'email': { type: String, default: "",  trim: true },
    'achievements': { type: String, default: "" },
    'id': { type: String, require: true, unique: true },
    'password': { type: String, require: true },
    'actived': { type: Boolean, default: true },
    'role': { type: String, required: true }    
});

/**
 * Metodo para encriptar la contraseña del usuario
 * @param {*} password 
 */
 PersonSchema.statics.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

/**
 * Metodo para comparar la contraseña recibida con la actual
 * @param {*} receivedPassword 
 * @param {*} password 
 */
 PersonSchema.statics.matchPassword = async(receivedPassword, password) => {
    return await bcrypt.compare(receivedPassword, password);
};

export default model('Person', PersonSchema);