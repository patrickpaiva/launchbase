const User = require('../models/User')
const { compare } = require('bcrypt')

function getFirstName(user) {

    let userName = user.name
    userName = userName.split(' ')
    user.firstName = userName[0]

    return user
}

function checkAllFields(body) {
    //check if has all fields
    const keys = Object.keys(body)

    getFirstName(body)
    
    for(key of keys) {
        if (body[key] == "" && key != "password_confirmation") {
            return {
                user: body,
                error: "Por favor, preencha todos os campos."
            }
        }
    }
}

async function show(req, res, next) {
    if (req.session.userId) {
        const { userId: id } = req.session

        const user = await User.findOne({ where: {id} })

        if(!user) return res.render("admin/users/profile", {
            error: "Usuário não encontrado!"
        })

        req.user = user
    } else {
        return res.redirect('/users/login')
    }

    next()
        
}
async function post(req, res, next) {
    //check if has all fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render("admin/users/create-user", fillAllFields)
    }

    let { email } = req.body

    const user = await User.findOne({ 
        where: {email}
    })

    if (user) return res.render('admin/users/create-user', {
        user: req.body,
        error: "Usuário já cadastrado."
    })
    
    next()
}
async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render("admin/users/profile", fillAllFields)
    }

    const { id, password } = req.body

    getFirstName(req.body)

    if(!password) return res.render("admin/users/profile", {
        user: req.body,
        error: "Coloque sua senha para atualizar seu cadastro."
    })

    const user = await User.findOne({ where: {id} })

    const passed = await compare(password, user.password) 

    if(!passed) return res.render('admin/users/profile', { 
        user: req.body,
        error: "Senha incorreta."
    })

    req.user = user

    next()
}

module.exports = {
    post,
    show,
    update
}