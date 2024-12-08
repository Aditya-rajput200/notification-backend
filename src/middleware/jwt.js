const jwt = require("jsonwebtoken");

require("dotenv").config();
 
const secret = process.env.jwt_SECRET;


module.exports.CreateToken = async (id) => {
    const token = jwt.sign({ id }, secret );
     return token    
}


module.exports.VerifyToken = async (req, res,next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "No token provided" });
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}   