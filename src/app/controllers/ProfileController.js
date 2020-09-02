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

            const { name, email } = req.body


            await User.update(user.id, {
                name,
                email,
            })

            return res.render('admin/users/profile', {
                 user: req.body,
                 isAdmin: req.session.isAdmin,
                 success: 'Usuário atualizado com sucesso!'
            })


        } catch (err) {
            console.error(err)
            return res.render('admin/users/profile', {
                user: req.body,
                isAdmin: req.session.isAdmin,
                error: 'Ocorreu um erro ao atualizar. Tente novamente mais tarde.'
           })
        }
    }
}