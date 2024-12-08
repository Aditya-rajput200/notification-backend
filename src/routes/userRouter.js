const express = require('express');

const { userLogin, userRegister } = require('../controlers/userControler');
const user_router = express.Router();

user_router.post('/login',userLogin );
user_router.post('/register',userRegister);

module.exports = user_router;