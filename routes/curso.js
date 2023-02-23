const { Router } = require('express');
const { check } = require('express-validator');

const { existeCursoPorId, cursoExiste } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

//Controllers
const { obtenerCursos,
        crearCurso,
        actualizarCurso,
        eliminarCurso, 
        asignarAlumno} = require('../controllers/curso');

const router = Router();

router.get('/mostrar',[
    validarJWT,
    esAdminRole
], obtenerCursos);

router.post('/agregar',[
    validarJWT,
    check('nombreCurso', 'El nombre del curso es obligatorio para el post').not().isEmpty(),
    //check('alumnos', 'Asignar el curso a algun estudainte').not().isEmpty(),
    check('nombreCurso').custom( cursoExiste ),
    esAdminRole,
    validarCampos
], crearCurso);

router.put('/editar/:id',[
    validarJWT
], actualizarCurso);

router.delete('/eliminar/:id',[
    validarJWT,
    esAdminRole
], eliminarCurso);

router.get('/asignar/:idCurso',[
    validarJWT,
    esAdminRole
], asignarAlumno);

/*// Obtener todas los cursos - publico
router.get('/mostrar', obtenerCursos);

// Obtener un curso por el id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCursoPorId ),
    validarCampos
],obtenerCursoPorId);

// Crear curso - privado - cualquier persona con un token valido
router.post('/agregar', [
    validarJWT,
    check('nombreCurso', 'El nombre del curso es obligatorio').not().isEmpty(),
    check('nombreCurso', 'El curso no es valido').equals('nombreCurso'),
    check('nombreCurso').custom( cursoExiste ),
    validarCampos
], crearCurso);

// Actualizar curso - privado - se requiere id y un token valido
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCursoPorId ),
    check('nombreCurso', 'El nombre del curso es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCurso);

// Borrar una curso - privado - se requiere id y un token valido - solo el admin puede borrar
router.delete('/eliminar/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCursoPorId ),
    validarCampos
], eliminarCurso);*/

module.exports = router;