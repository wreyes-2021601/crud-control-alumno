const { Schema, model } = require('mongoose');

const PersonaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El contraseña es obligatorio']
    },
    rol: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    cursos:{
        type: Array,
        default: [],
        required: true
    }
});

module.exports = model('Persona', PersonaSchema)