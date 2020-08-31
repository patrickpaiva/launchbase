const express = require('express')
const routes = express.Router()
const SessionController = require('../app/controllers/SessionController')
const ProfileController = require('../app/controllers/ProfileController')
const SessionValidator = require('../app/validators/SessionValidator')
const UserValidator = require('../app/validators/UserValidator')
const UserController = require('../app/controllers/UserController')
const { onlyUsers, isLoggedRedirectToUsers } = require('../app/middlewares/session');


// // login/logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)

routes.post('/login', SessionValidator.login, SessionController.login)

routes.post('/logout', SessionController.logout)

// // reset password / forgot

// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/password-reset', SessionController.resetForm)
// routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
// routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

// Rotas de perfil de um usuário logado
routes.get('/admin/profile', onlyUsers, UserValidator.show, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/admin/profile', onlyUsers, UserValidator.update, ProfileController.update)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
// routes.get('/admin/users', UserController.list) //Mostrar a lista de usuários cadastrados
routes.get('/admin/create', onlyUsers, UserController.create)// Página para criar um novo usuário
routes.post('/admin/create', onlyUsers, UserValidator.post, UserController.post) //Cadastrar um usuário
// routes.put('/admin/users', UserController.put) // Editar um usuário
// routes.delete('/admin/users', UserController.delete) // Deletar um usuário

module.exports = routes
