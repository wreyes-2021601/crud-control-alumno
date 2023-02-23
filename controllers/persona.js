//Importacion
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

//Modelos
const Persona = require('../models/persona');


const getPersonas = async (req = request, res = response) => {

    //Condición, me busca solo las personas que tengan estado en true
    const query = { estado: true };

    const listaPersonas = await Promise.all([
        Persona.countDocuments(query),
        Persona.find(query)
    ]);

    res.json({
        msg: 'GET API de personas',
        listaPersonas
    });

}

const postPersona = async (req = request, res = response) => {

    const { nombre, correo, password, rol, cursos } = req.body;
    const personaDB = new Persona({ nombre, correo, password, rol, cursos });

    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    personaDB.password = bcryptjs.hashSync(password, salt);

    //Guardar en Base de datos
    await personaDB.save();

    res.status(201).json({
        msg: 'POST API de personas',
        personaDB
    });

}
const putPersona = async (req = request, res = response) => {

    const { id } = req.params;

    //Ignoramos el _id, rol, estado al momento de editar y mandar la petición en el req.body
    const { _id, rol, estado, ...resto } = req.body;

    // //Encriptar password
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(resto.password, salt);

    //editar y guardar
    const personaEditada = await Persona.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT API de personas',
        personaEditada
    });

}


const deletePersona = async (req = request, res = response) => {

    const { id } = req.params;

    //eliminar fisicamente y guardar
    //const personaEliminada = await Persona.findByIdAndDelete(id);

    // O bien cambiando el estado del usuario

    //editar y guardar
    const personaEliminada = await Persona.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'DELETE API de personas',
        personaEliminada
    });

}



module.exports = {
    getPersonas,
    postPersona,
    putPersona,
    deletePersona
}