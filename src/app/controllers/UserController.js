const User = require("../models/User")
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcrypt');

function getFirstName(user) {

    let userName = user.name
    userName = userName.split(' ')
    user.firstName = userName[0]

    return user
}

module.exports = {
    async create(req, res) {
        return res.render('admin/users/create-user')
    },
    async post(req, res) {

        const password = crypto.randomBytes(8).toString('hex')

        const passwordHashed = await hash(password, 8);

        const { name, email, isAdmin } = req.body

        const newUser = {
            ...req.body,
            passwordHashed,
            isAdmin,
        }

        await User.createUser(newUser)

        await mailer.sendMail({
            to: email,
            from: 'no-reply@foodfy.com',
            subject: 'Senha Foodfy',
            html: `<h2>Novo Cadastro Foodfy</h2>
            <p>${name}, bem-vindo ao Foodfy. Abaixo segue sua para acesso.</p>
            <p>Senha: ${password}</p>
            `,
        })

        return res.redirect('/users/admin/profile')
        
    },
    async list(req, res) {
        const users = await User.findAll()

        return res.render('admin/users/users-list', { users })
    },
    async show(req, res) {
        const { id } = req.params
        const user = await User.findOne({ where: {id} })

        getFirstName(user)

        return res.render('admin/users/admin-user-profile', { user })
    }
}