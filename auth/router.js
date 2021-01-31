const express = require('express');
const { registerController, loginController, currentUserController } = require('./controllers');
const authRouter = express.Router();

authRouter.route('/register').post(registerController);

authRouter.route('/login').post(loginController);

authRouter.route('/current_user').get(currentUserController);

module.exports = authRouter;