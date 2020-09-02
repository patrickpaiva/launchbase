const express = require('express')
const routes = express.Router()
const SessionController = require('../app/controllers/SessionController')
const ProfileController = require('../app/controllers/ProfileController')
const SessionValidator = require('../app/validators/SessionValidator')
const UserValidator = require('../app/validators/UserValidator')
const UserController = require('../app/controllers/UserController')
const { onlyUsers, isLoggedRedirectToUsers, isAdmin } = require('../app/middlewares/session');


// // login/logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)

routes.post('/login', SessionValidator.login, SessionController.login)

routes.post('/logout', SessionController.logout)

// // reset password / forgot

routes.get('/forgot-password', SessionController.forgotForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

// Rotas de perfil de um usuário logado
routes.get('/admin/profile', onlyUsers, UserValidator.show, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/admin/profile', onlyUsers, UserValidator.update, ProfileController.update)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/admin/list', onlyUsers, isAdmin, UserController.list) //Mostrar a lista de usuários cadastrados
routes.get('/admin/create', onlyUsers, isAdmin, UserController.create)// Página para criar um novo usuário
routes.post('/admin/create', onlyUsers, isAdmin, UserValidator.post, UserController.post) //Cadastrar um usuário
routes.get('/admin/edit/:id', onlyUsers, isAdmin, UserController.show) // Editar um usuário
routes.put('/admin/edit/:id', onlyUsers, isAdmin, UserController.update) // Editar um usuário
routes.delete('/admin/edit/:id', onlyUsers, isAdmin, UserController.delete) // Deletar um usuário

module.exports = routes
