const express = require('express');
const { getSingleStudentByID, updateStudent } = require('../controllers/students.controller.js');
const {requireSignIn, isAuth} = require('../utils/authentication.js');




const studentsRouter = express.Router();

// console.log('it has come to routes block')
studentsRouter.get('/:operatorID/students/:studentID', requireSignIn, isAuth, getSingleStudentByID);
studentsRouter.put('/:operatorID/students/:studentID', requireSignIn, isAuth, updateStudent);


module.exports = studentsRouter;


