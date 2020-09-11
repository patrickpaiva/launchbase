const User = require('../models/User')
const { compare } = require('bcrypt')

async function login(req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({ where: {email} })

    if(!user) return res.render("admin/session/login", {
        user: req.body,
        error: "Usuário e/ou senha inválidos."
    })

    const passwordCheck = await compare(password, user.password) 

    if(!passwordCheck) return res.render('admin/session/login', { 
        user: req.body,
        error: "Usuário e/ou senha inválidos."
    })
    req.user = user
    
    next()
}

async function forgot(req, res, next) {
    const { email } = req.body
    try {
        let user = await User.findOne( { where: {email} })

        if(!user) return res.render("admin/session/forgot-password", {
            user: req.body,
            error: "E-mail não cadastrado!"
        })

        req.user = user

        next()

    }
    catch (err) {
        console.error(err)
    }

}

async function reset(req, res, next) {
    const { email, password, token, password_confirmation } = req.body

    const user = await User.findOne({ where: {email} })

    if(!user) return res.render("admin/session/password-reset", {
        user: req.body,
        token,
        error: "Usuário não encontrado!"
    })

    if (password != password_confirmation)
        return res.render('admin/session/password-reset', {
            user: req.body,
            token,
            error: "As senhas digitadas não conferem"
        })

    if (token != user.reset_token) return res.render('admin/session/password-reset', {
        user: req.body,
        token,
        error: "Token inválido! Solicite uma nova recuperação de senha." 
    })

    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('admin/session/password-reset', {
        user: req.body,
        token,
        error: "Token expirado. Por favor, solicite uma nova recuperação de senha." 
    })

    req.user = user
    next()
}

module.exports = {
    login,
    forgot,
    reset
}