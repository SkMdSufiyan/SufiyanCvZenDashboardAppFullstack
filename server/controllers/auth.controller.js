const studentsModel = require('../models/students.model.js'); // Importing the students model
const bcrypt = require('bcrypt'); // Importing bcrypt package
const jwt = require('jsonwebtoken'); // Importing the jsonwebtoken package
const nodemailer = require('nodemailer'); // Importing the nodemailer package


// Exporting the function which performs signup
exports.signup = async (req, res) => {
    // console.log('it has come to signup block');
    // console.log(process.env.SENDER_EMAIL);
    // console.log(process.env.SENDER_EMAIL_PASSWORD);
    try{
        const payload = req.body;
        const email = payload.email;

        // Checking whether a student already exists in the database with the supplied email id
        const isEmailAlreadyExists = await studentsModel.findOne({email : email})

        if(isEmailAlreadyExists){
            // If an student already exists with this email id in the database, returning message
            return res.status(400).send({message: "Email id already exists."})
        }


        // If there is no existing student with this email id in the database, then creating a new student
        // Hashing the password given by the student
        const hashValue = await bcrypt.hash(payload.password, 10);
        payload.hashedPassword = hashValue; // Storing it in the payload
        delete payload.password; // Deleting the password supplied by the student


        // Now, an account activation email will be sent with activation link
        // If the email is sent successfully, then the student will be saved in the database

        // Creating an account activation token
        const accountActivationToken = jwt.sign({email : email }, process.env.SECRET_KEY_FOR_ACCOUNT_ACTIVATION, {expiresIn : "1hr"});

        // Storing the accountActivationToken in the "accountActivationToken" field of the payload
        payload.accountActivationToken = accountActivationToken;

        // Creating an account activation link with the frontend url followed by the "/account-activation/" route in frontend followed by the "accountActivationToken" as params
        const accountActivationLink = `${process.env.FRONTEND_URL}/activate-account/${accountActivationToken}`;

        // Creating a nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_EMAIL_PASSWORD
            },
        });

        // Creating an email message
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Zen Student Dashboard Account activation.',
            html : `
                <h2>Click the link below to activate your account in the Zen Student Dashboard application.:</h2>\n\n 
                <a href=${accountActivationLink}> ${accountActivationLink} </a>
                `
        };
    
        // Sending the email
        await transporter.sendMail(mailOptions)
        .then(async (emailResult) => {
            // Creating a new student
            const newStudent = new studentsModel(payload);
            await newStudent.save()
                    .then(registrationResult => {
                        res.status(200).send({message: "Student registered successfully, and an account activation link is emailed successfully. Please click that link to activate your account.", _id: registrationResult._id});
                    })
                    .catch(err => {
                        res.status(400).send({message: "Failed to register the student. The account activation link emailed will be invalid.", error: err});
                    })
        })
        .catch(err => {
            // console.log(err)
            res.status(400).send({message: "Failed to send account activation email. Due to this the student is not registered in the database.", error: err});
        })
    

    }catch(error){
        res.status(500).send({message: "Internal server error.", error: error});
    }

}


// Exporting the function which performs account activation of the registered student
exports.activateAccount = async (req, res) => {
    try{
        const accountActivationToken = req.params.accountActivationToken;

        jwt.verify(accountActivationToken, process.env.SECRET_KEY_FOR_ACCOUNT_ACTIVATION, async (err, decodedToken) => {
            if(err){
                return res.status(400).send({message : "The token is invalid / expired."});
            }else{
                const {email} = decodedToken;
                const studentData = await studentsModel.findOne({email : email});

                if(studentData.accountActivationToken === accountActivationToken){
                    await studentsModel.findOneAndUpdate({email : email}, {$set : {isActivated : true, accountActivationToken : "" }})
                    .then(result => {
                        res.status(200).send({message : "Your account is activated successfully. Now you can login to your Zen Student Dashboard account."});
                    } )
                    .catch(err => {
                        res.status(400).send({message : "Failed to activate the account.", error : err});
                    })

                }else{
                    return res.status(400).send({message : "The link is already used. Your account is alreday activated."});
                }
            }
        })

    }catch(error){
        res.status(500).send({message : "Internal server error", error : error});
    }
}


// Exporting the function which performs login
exports.login = async (req, res) => {
    try{
        const payload = req.body;
        // Checking whether the student exists in the database or not
        const existingStudent = await studentsModel.findOne({email: payload.email});
        if(existingStudent){
            // If the student exists
            if( ! existingStudent.isActivated){
                // If the student account is not yet activated
                return res.status(401).send({message : "Your account is not activated yet. To login, kindly activate your account using the link emailed to your registered email id."});
            }

            // If the student account is activated

            // Checking whether the password is correct or not
            const isValidCredentials = await bcrypt.compare(payload.password, existingStudent.hashedPassword);

            if(isValidCredentials){
                // If the email and password are correct
                // Creating a jwt token
                const accessToken = jwt.sign({_id : existingStudent._id}, process.env.SECRET_KEY_FOR_LOGIN);
                // This jwt token will be sent to frontend where it will be stored in the localStorage and used for authenticating the frontend routes

                // Sending the student profile
                const studentProfile = {...existingStudent.toObject()};
                delete studentProfile.hashedPassword;

                res.status(200).send({message: "Signed in successfully.", _id: existingStudent._id, accessToken : accessToken, studentProfile : studentProfile});
            
            }else{
                // If the password is wrong, returning message
                res.status(400).send({message: "Invalid credentials."})
            }
        }else{
            // If the student does not exist in the database, returning message
            res.status(400).send({message: "Student does not exist."});
        }

    }catch(error){
        res.status(500).send({message: "Internal server error.", error: error});
    }

}

// If the accessToken is stored in the cookies, then the below function will be called from the frontend for logout operation
// Exporting the function which performs logout
exports.logout = async (req, res) => {
    try{
        // Clearing the "accessToken" (which was stored after login) from the cookies
        await res.clearCookie("accessToken");
        res.status(200).send({message: "Signed out successfully."});
    }catch(error){
        res.status(500).send({message: "Internal server error.", error: error});
    }
}


// Exporting the function which performs forgot password
// It will send a link for resetting the password
exports.forgotPasswordSendEmail = async (req, res) => {
    try{

        const payload = req.body;
        const email = payload.email;
        // Checking whether the student exists in the database
        const studentExists = await studentsModel.findOne({email : email});
        
        if(studentExists){
            // If the student exists in the database

            if( ! studentExists.isActivated){
                // If the student account is not yet activated
                return res.status(401).send({message : "Your account is not activated yet. To reset your password, kindly activate your account using the link emailed to your registered email id."});
            }

            // If the student account is activated

            // Creating a reset password token
            const resetPasswordToken = jwt.sign({email : studentExists.email }, process.env.SECRET_KEY_FOR_RESET_PASSWORD, {expiresIn : "15m"});

            // Storing the resetPasswordToken in the "resetPasswordToken" field of the student in the database
            await studentsModel.findOneAndUpdate({email : email}, {$set: {resetPasswordToken : resetPasswordToken}});
    
            // Creating a reset password link with the frontend url followed by the "/reset-password/" route in frontend followed by the resetPasswordToken as params
            const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`;
    
            // Creating a nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_EMAIL_PASSWORD
                },
            });
    
            // Creating an email message
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Password Reset',
                html : `
                 <h2>Click the link below to reset your password for your Zen Student Dashboard account:</h2>\n\n 
                 <a href=${resetPasswordLink}> ${resetPasswordLink} </a>
                 `
            };
      
            // Sending the email
            await transporter.sendMail(mailOptions)
            .then(result => {
                res.status(200).send({message : "Email has been sent successfully."});
            })
            .catch(err => {
                res.status(400).send({message: "Failed to send email.", error: err});
            })
        }else{
            res.status(400).send({message: "Email does not exist in the database."});
        }
       
    }catch(error){
        res.status(500).send({message: "Internal server error.", error: error});
    }
}


// Exporting the function which verifies the resetPasswordToken
// This function will be called from the frontend when the student opens the reset link
exports.verifyResetAccessToken = async (req, res) => {
    try{
        const resetToken = req.params.resetToken; // Taking the token from the params
        // Verifying the validity of the token
        jwt.verify(resetToken, process.env.SECRET_KEY_FOR_RESET_PASSWORD, async (err, decodedToken) => {
            if(err){
                // If the token is invalid or expired, returning a message
                res.status(401).send({message: "Link is invalid / expired"});
            }else{
                const studentData = await studentsModel.findOne({email: decodedToken.email});
                if(studentData.resetPasswordToken !== resetToken){
                    // If the student has already used the link and reset the password already
                    // Returning a message
                    return res.status(401).send({message: "Link is already used. Kindly initiate a new request for resetting your password."});
                }
                // If the token is valid, returing a message and the student email decoded from the token
                res.status(200).send({message: "Token is verified and is valid. Can reset the password.", data: {email: decodedToken.email}});
            }
        })

    }catch(error){
        res.status(500).send({message: "Internal server error.", error : error});
    }
}


// Exporting the function which resets the password
// This function will be called from the frontend when the student opens the link and the token is verified and if the token is valid
exports.resetPassword = async (req, res) => {
    try{
        const resetToken = req.params.resetToken; // Taking the token from the params
        const {email, newPassword} = req.body; // Taking the email and newPassword from the request body

        // Verifying the validity of the token
        jwt.verify(resetToken, process.env.SECRET_KEY_FOR_RESET_PASSWORD, async (err, decodedToken) => {
            if(err){
                // If the token is invalid or expired, returning a message
                res.status(401).send({message: "Link is invalid / expired"});
            }else{
                // If the token is valid
                // Verifying whether the "resetPasswordToken" field of the student contains the same token or not (in the database)
                const studentData = await studentsModel.findOne({email: email});
                if(studentData.resetPasswordToken === resetToken){
                    // If the "resetPasswordToken" field of the student contains the same token
                    // i.e. the student is using the reset link for the first time

                    // Then creating the hashed value of the new password
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    // Updating the "hashedPassword" field of the student in the database
                    await studentsModel.findOneAndUpdate({email : email}, {$set: {hashedPassword : hashedPassword, resetPasswordToken : "" }})
                    .then(result => {
                        res.status(200).send({message : "Password is updated successfully.", data : result});
                    })
                    .catch(err => {
                        res.status(400).send({message: "Failed to update the password.", error : err});
                    })
                }else{
                    // If the student has already used the link and reset the password already
                    // Returning a message
                    res.status(401).send({message: "Link is already used. Kindly initiate a new request for resetting your password."});
                }
            }
        });

    }catch(error){
        res.status(500).send({message: "Internal server error.", error: error})
    }

}











