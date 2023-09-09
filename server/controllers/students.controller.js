const studentsModel = require('../models/students.model.js');



exports.getSingleStudentByID = async (req, res) => {
    // console.log('it has come to get function');
    try{
        const studentID = req.params.studentID;
        await studentsModel.findOne({_id : studentID})
        .then( result => {
            
            if(result){
                res.status(200).send({message : "Student data is obtained successfully", data : result});
            }else{
                res.status(400).send({message : "Student not found"});
            }
        })
        .catch(err => {
            res.status(400).send({message : "Failed to obtain the student data", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}





// Email and password can not be updated (to update password, reset password option is there)
// Only the profile details can be updated here
exports.updateStudent = async (req, res) => {
    // console.log('it has come to update function');
    try{
        
        const studentID = req.params.studentID;
        const payload = req.body;

        await studentsModel.findOneAndUpdate({_id : studentID}, {$set : payload})
        .then(result => {
            if(result){
                res.status(200).send({message : "Student data is updated successfully"});
            }else{
                res.status(400).send({message : "Student not found"});
            }
        })
        .catch(err => {
            res.status(400).send({message : "Failed to update the student data", error : err});
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}




// exports.attachProfileOfStudent = async (req, res, next, id) => {
//     try{
//         const data = await studentsModel.findOne({ _id : id});
//             if(! data){
//                 return res.status(400).send({message : "Student does not exist"});
//             }
//             req.profile = data; // Adding the profile of the student to verify whether he is an admin, or a manager, or an employee with rights, or an employee without rights
            
//             next();

//     }catch(error){
        
//         res.status(500).send({message : "Internal server error"});
//     }
// }


