const mongoose = require('mongoose'); // Importing mongoose

// Creating schema for user
const studentSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    hashedPassword : {
        type : String,
        required : true,
        trim : true
    },
    isActivated : {
        type : Boolean,
        default : false
    },
    accountActivationToken : {
        type : String,
        trim : true,
        default : ""
    },
    resetPasswordToken : {
        type : String,
        trim : true,
        default : ""
    },
    queries : {
        type : Array,
        default : []
    },
    submittedTasks : {
        type : Array,
        default : []
    },
    numOfTotalClasses : {
        type : Number,
        default : 37
    },
    attendedClassNumbers : {
        type : Array,
        default : []
    },
    conductedClassNumbers : {
        type : Array,
        default : [1]
    },
    webcodes : {
        type : Array,
        default : []
    },
    capstone : {
        type : Array,
        default : []
    },
    portfolio : {
        type : Array,
        default : []
    },
    totalClassTitles : {
        type : Array,
        default : ["Javascript - Day -1 : Introduction to Browser & web",
                    "Javascript - Day -2 : Request & Response cycle",
                    "Javascript - Day -3 : JS array & objects",
                    "Javascript - Day -4 : What is XMLHTTPRequest?",
                    "Javascript - Day -5 : Functions",
                    "Javascript - Day -6 : ES5 vs ES6",
                    "Javascript - Day -7 : OOP",
                    "Javascript - Day -8 : MRF - array method",
                    "HTML- Day -1 : HTML",
                    "HTML & CSS- Day -2 : HTML & CSS",
                    "HTML & CSS- Day -3 : HTML & CSS",
                    "HTML & CSS- Day -4 : HTML & CSS",
                    "HTML & CSS- Day -5 : Responsive web design",
                    "DOM- Day -1 : DOM",
                    "DOM- Day -2 : Document vs Window",
                    "Async programming- Day -1 : Callback",
                    "Async programming- Day -2 : Promise",
                    "Async programming- Day -3 : Promise",
                    "Async programming- Day -4 : Promise fetch - request info & request init",
                    "React- Day -1 : React",
                    "React- Day -2 : React hooks & states",
                    "React- Day -3 : React components",
                    "React- Day -4 : react router",
                    "React- Day -5 : recap with previous day toopics",
                    "React- Day -6 : Context API",
                    "React- Day -7 : Axios",
                    "React- Day -8 : formik in react",
                    "Database - MySQL",
                    "Database - MySQL",
                    "Database - MongoDB",
                    "MongoDB",
                    "Nodejs- Day -1 : Nodejs",
                    "Nodejs- Day -2 : Nodejs & Expressjs",
                    "Nodejs- Day -3 : Node & mongo DB connectivity",
                    "Nodejs- Day -4 : Nodejs deployment",
                    "Nodejs- Day -5 : Authentication",
                    "Nodejs- Day -6 : JWT"
                ]
    }
});

// Creating and exporting students model
module.exports = mongoose.model("Students", studentSchema);