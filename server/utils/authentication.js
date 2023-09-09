const {expressjwt} = require('express-jwt');


// Returns unauthorized error message in response
exports.requireSignIn = (req, res, next) => {
    expressjwt({
        secret: process.env.SECRET_KEY_FOR_LOGIN,
        algorithms: ['HS256'],
        requestProperty: 'auth',
    })(req, res, (err) => {
        if (err) {
            return res.status(401).send({message : "You are unauthorised to access this page !!!"});
        }
        next();
    });
};


exports.isAuth = (req, res, next) => {
    const student = req.auth._id === req.params.operatorID;
    if( ! student){
        return res.status(404).send({message : "Access denied !!! Sign In again !!!"});
    }

    const isSelfRequest = req.params.operatorID === req.params.studentID;

    if(! isSelfRequest){
        return res.status(404).send({message : "Access denied !!! You are not authorized to access other students details !!!"});
    }

    next();
}



