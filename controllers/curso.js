//Importacion
const { response, request } = require('express');
//Modelos
const Curso = require('../models/curso');
const Persona = require('../models/persona');

const obtenerCursos = async(req = request, res = response) => {

     //Condición, me busca solo los curso que tengan estado en true
     const query = { estado: true };

     const listaCursos = await Promise.all([
         Curso.countDocuments(query),
         Curso.find(query)
                .populate('persona', 'nombre')
     ]);
 
     res.json({
         msg: 'GET API de curso',
         listaCursos
     });

}

const obtenerCursoPorId = async(req = request, res = response) => {

    const { id } = req.params;
    const curso = await Curso.findById( id )
                                            .populate('persona', 'nombre')

    res.json({
        msg: 'curso por id',
        curso
    });

}

const asignarAlumno = async(req = request, res = response) =>{
    const {idCurso} = req.params;
    const persona = req.persona._id;
    const cursos = req.persona.cursos;
    const existeCurso = await Curso.findOne({_id: idCurso});
    if(!existeCurso){
        return res.status(404).json({
            msg: 'curso no encontrado'
        })
    }
    if(cursos.length >= 3){
        return res.status(400).json({
            msg: 'Solo puedes estar en 3 cursos'

        })
    }
    for(let curso of cursos){
        if(existeCurso._id != curso) continue
        var exists = curso
    }
    if(exists) return res.status(400).json({ msg: 'ya estas asignado a este curso'})
    const updatedPersona = await Persona.findOneAndUpdate(
        {_id: persona},
        {$push: {'curso': idCurso}},
        {new: true}
    );
    const updatedCurse = await Curso.findOneAndUpdate(
        {_id: idCurso},
        {$push: {'alumnos': persona}},
        {new: true}
    )
    res.status(200).json({
        msg: 'Alumno asignado',
        updatedPersona,
        updatedCurse
    })
}


const crearCurso = async (req = request, res = response) => {
                                //operador spread
        const { estado, persona, ...body } = req.body;

        //validación si existe un curso en la db
        const cursoEnDB = await Curso.findOne( { nombreCurso: body.nombreCurso } );

        if ( cursoEnDB ) {
            return res.status(400).json({
                mensajeError: `El curso ${ cursoEnDB.nombreCurso } ya existe en la DB`
            });
        }


        //Generar data a guardar
        const data = {
            ...body,
            nombreCurso: body.nombreCurso.toUpperCase(),
            persona: req.persona._id
        }

        const curso = new Curso( data );

        //Guardar en DB
        await curso.save();

        res.status(201).json({
            msg: 'Post curso',
            curso
        });


}


const actualizarCurso = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, estado, persona, ...data } = req.body;

    if ( data.nombreCurso ) {
        data.nombreCurso = data.nombreCurso.toUpperCase();
    }
    
    data.persona = req.persona._id; //hacemos referencia a la persona que hizo el put por medio del token

    //Edición de producto               // new: true Sirve para enviar el nuevo documento actualizado     
    const curso = await Curso.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        msg: 'Put de curso',
        curso
    });

}


const eliminarCurso = async(req = request, res = response) => {

    const { id } = req.params;
    const CursoBorrado = await Curso.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        msg: 'delete curso',
        CursoBorrado
    });

}



module.exports = {
    obtenerCursos,
    asignarAlumno,
    crearCurso,
    actualizarCurso,
    eliminarCurso
}