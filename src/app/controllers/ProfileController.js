const User = require("../models/User")
const { hash } = require('bcrypt')

function getFirstName(user) {

    let userName = user.name
    userName = userName.split(' ')
    user.firstName = userName[0]

    return user
}

module.exports = {
    async index(req, res) {
        const { user } = req

        getFirstName(user)
        
        return res.render('admin/users/profile', { user })
    },    
    async update(req, res) {
        try {
            const { user } = req

            getFirstName(user)

            const { name, email, password, password_confirmation } = req.body

            if (password_confirmation && password !== password_confirmation) {
                return res.render('admin/users/profile', {
                    user: {
                        ...req.body,
                        firstName: req.user.firstName,
                    },
                    error: 'As senhas digitadas não conferem.'
                })
            }

            const passwordHashed = await hash(password, 8)

            await User.update(user.id, {
                name,
                email,
                password: passwordHashed,
            })

            return res.render('admin/users/profile', {
                 user: req.body,
                 success: 'Usuário atualizado com sucesso!'
            })


        } catch (err) {
            console.error(err)
            return res.render('admin/users/profile', {
                user: req.body,
                error: 'Ocorreu um erro ao atualizar. Tente novamente mais tarde.'
           })
        }
    }
}