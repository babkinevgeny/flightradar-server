const express = require('express');
const { registerController, loginController, currentUserController, saveFavorites } = require('./controllers');
const authRouter = express.Router();

authRouter.route('/register').post(registerController);

authRouter.route('/login').post(loginController);

authRouter.route('/current_user').get(currentUserController);

authRouter.route('/save_favorites').put(saveFavorites);

module.exports = authRouter;