const { Router } = require('../utils/router')
const myController = require('../controllers/controllerIndex')

var router = new Router()

router.post('/api/register', myController.register)
router.post('/api/auth', myController.authenticate)
router.get('/api/user', myController.identifyUser)
router.get('/api/homepage', myController.homepage)
router.get('/api/course', myController.courseInfo)
router.post('/api/update', myController.settingsAccount)
router.get('/api/logout', myController.logout)
router.post('/api/enter-new-class', myController.enterNewClass)
router.get('/api/grades', myController.getStudentGrades)
router.get('/api/assignments', myController.getClassAssignments)
router.post('/api/create-class', myController.createNewClass)
router.get('/api/assignment', myController.getAssignment)
router.get('/api/all-assignments', myController.getAllStudentAssignment)
router.get('/api/catalog', myController.getClassCatalog)
router.get('/api/news', myController.getNews)

module.exports.index = router