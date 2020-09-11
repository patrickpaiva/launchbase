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
        if (body[key] == "") {
            return {
                user: body,
                isAdmin: body.isAdmin,
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
            isAdmin: req.session.isAdmin,
            error: "Usuário não encontrado!"
            
        })

        req.user = user
    } else {
        return res.redirect('/users/login')
    }

    next()
        
}
async function edit(req, res, next) {
    
    const { id } = req.params

    const user = await User.findOne({ where: {id} })

    if(!user) return res.redirect("/not-found")

    next()
        
}
async function post(req, res, next) {
    //check if has all fields
    body = {
        ...req.body,
        isAdmin: req.session.isAdmin
    }
    const fillAllFields = checkAllFields(body)
    if(fillAllFields) {
        return res.render("admin/users/create-user", fillAllFields)
    }

    let { email } = req.body

    const user = await User.findOne({ 
        where: {email}
    })

    if (user) return res.render('admin/users/create-user', {
        user: req.body,
        isAdmin: req.session.isAdmin,
        error: "Usuário já cadastrado."
    })
    
    next()
}
async function update(req, res, next) {
    body = {
        ...req.body,
        isAdmin: req.session.isAdmin
    }
    const { id, password } = req.body
    
    getFirstName(req.body)
    
    if(!password) return res.render("admin/users/profile", {
        user: req.body,
        isAdmin: req.session.isAdmin,
        error: "Coloque sua senha para atualizar seu cadastro."
    })
    
    const user = await User.findOne({ where: {id} })
    
    const passed = await compare(password, user.password) 
    
    if(!passed) return res.render('admin/users/profile', { 
        user: req.body,
        isAdmin: req.session.isAdmin,
        error: "Senha incorreta."
    })
    
    const fillAllFields = checkAllFields(body)
    if(fillAllFields) {
        return res.render("admin/users/profile", fillAllFields)
    }

    req.user = user

    next()
}

module.exports = {
    post,
    show,
    update,
    edit
}