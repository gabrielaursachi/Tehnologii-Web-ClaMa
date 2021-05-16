const { Router } = require('../utils/router')
const myController = require('../controllers/controllerIndex')

var router = new Router()

router.post('/api/register', myController.register)
router.post('/api/auth', myController.authenticate)
router.get('/api/user', myController.identifyUser)
router.get('/api/homepage', myController.homepage)
router.get('/api/course', myController.courseInfo)
router.post('/api/update', myController.settingsAccount)

// '/api/course/{id_course}'
//'/api/assignments/all/{id_user???}'
//'/api/assignments/done/{id_user???}'
//'/api/assignments/todo/{id_user???}'
//'/api/assignments/{id_assignment}' 
module.exports.index = router