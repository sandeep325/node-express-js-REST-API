const jwt = require("jsonwebtoken");
module.exports = (req,res, next ) => { 
    // const  authTokenByClient =  req.body.token; 
    // console.log(req.headers.authorization);
    const IScheckToken = req.headers.authorization;
                 if(!IScheckToken) {
        return res.status(404).json({ status:404, message:"Please Enter Token(key). "});
                     
              }

    try {  
    const authTokenByClient = IScheckToken.split(" ")[1];
    const decoded = jwt.verify(authTokenByClient, process.env.JWT_KEY);
    req.userData =  decoded ; 
    next();
    } 
    catch(error) {
        return res.status(401).json({ status:401, message:"You are unauthenticate user (Token invalid). "});

    }
}