// import controllers review, products
const userController = require('../controllers/userController.js')
const mailController=require('../controllers/mailController.js')
// router
const router = require('express').Router()


// user routers
router.post('/addUser', userController.addUser)

//router.get('/search',)

router.get('/allUsers', userController.getAllUsers)

router.get('/:id', userController.getOneUser)

router.put('/:id', userController.updateUser)

router.delete('/:id',userController.deleteUser)

router.get('/searchterm', userController.searchTerm)

router.post('/sendmail',mailController.sendmail)


module.exports = router