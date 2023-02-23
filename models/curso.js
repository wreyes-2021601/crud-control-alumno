const { Schema, model } = require('mongoose');

const CursoSchema = Schema({
    nombreCurso: {
        type: String,
        required: [true, 'El nombre del curso es obligatorio'],
        unique: true
    }, 
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    persona: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: true
    },
    descripcion: { 
        type: String 
    },
    alumnos:{
        type: Array,
        default:[],
        required: true
        
    }
});

module.exports = model('Curso', CursoSchema);