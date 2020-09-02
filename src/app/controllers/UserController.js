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
    async update(req, res) {
        try {
            const { id, name, email, isAdmin } = req.body

           

            await User.update(id, {
                name,
                email,
                is_admin: isAdmin || false,
            })

            return res.render('admin/users/admin-user-profile', {
                 user: req.body,
                 isAdmin: req.session.isAdmin,
                 success: 'Usuário atualizado com sucesso!'
            })


        } catch (err) {
            console.error(err)
            return res.render('admin/users/admin-user-profile', {
                user: req.body,
                isAdmin: req.session.isAdmin,
                error: 'Ocorreu um erro ao atualizar. Tente novamente mais tarde.'
           })
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params

            await User.delete(id)

            const users = await User.findAll()

            return res.render('admin/users/users-list', { 
                users,
                isAdmin: req.session.isAdmin,
                success: 'Usuário deletado com sucesso.'
            })
        } catch (err) {
            console.error(err)

            return res.render('admin/users/users-list', { 
                users,
                isAdmin: req.session.isAdmin,
                error: 'Não foi possível deletar. Tente novamente mais tarde.'
            })
        }
    },
    async list(req, res) {
        const users = await User.findAll()

        return res.render('admin/users/users-list', { users, isAdmin: req.session.isAdmin })
    },
    async show(req, res) {
        const { id } = req.params
        const user = await User.findOne({ where: {id} })

        getFirstName(user)

        return res.render('admin/users/admin-user-profile', { user })
    }
}