const { Router } = require('../utils/router')
const myController = require('../controllers/controllerIndex')

var router = new Router()

// router.get('/api/registerForm', myController.getHTML)
router.post('/api/register', myController.register)
router.post('/api/auth', myController.authenticate)
    // router.get('/api/homepage', myController.getHTML)

// '/api/homepage/{id_user}'  
// '/api/homepage/{id_user}/class/{id_class}'  
// '/api/course/{id_course}'
//'/api/assignments/all/{id_user???}'
//'/api/assignments/done/{id_user???}'
//'/api/assignments/todo/{id_user???}'
//'/api/assignments/{id_assignment}' 

// router.get('/index.js', indexController.getIndexJS)

///exemplu
///router.get(url_string, functieApelata)
///
module.exports.index = router