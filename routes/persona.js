//importaciones
const { Router } = require('express');
const { check } = require('express-validator');

const { getPersonas, postPersona, putPersona, deletePersona } = require('../controllers/persona');
const { emailExiste, esRoleValido, existePersonaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', validarJWT, esAdminRole, getPersonas);

router.post('/agregar', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio para el post').not().isEmpty(),
    check('password', 'La password es obligatorio para el post').not().isEmpty(),
    check('password', 'La passwarod debe ser mayor a 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    check('rol', 'El rol es obligatorio para el post').not().isEmpty(),
    check('rol').custom( esRoleValido ),
    check('cursos', 'La asignacion de al menos un curso es obligatorio para el post solo si es estudiante').not().isEmpty(),
    validarCampos
] , postPersona);


router.put('/editar/:id',[
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existePersonaPorId ),
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La password es obligatorio para el post').not().isEmpty(),
    check('password', 'La passwarod debe ser mayor a 6 letras').isLength({ min: 6 }),
    check('rol').custom( esRoleValido ),
    validarCampos
], putPersona);


router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existePersonaPorId ),
    validarCampos
] ,deletePersona);


module.exports = router;