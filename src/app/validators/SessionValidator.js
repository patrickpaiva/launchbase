const User = require('../models/User')
const { compare } = require('bcrypt')

async function login(req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({ where: {email} })

    if(!user) return res.render("session/login", {
        user: req.body,
        error: "Usuário não cadastrado!"
    })

    const passwordCheck = await compare(password, user.password) 

    if(!passwordCheck) return res.render('session/login', { 
        user: req.body,
        error: "Senha incorreta."
    })
    req.user = user
    
    next()
}

// async function forgot(req, res, next) {
//     const { email } = req.body
//     try {
//         let user = await User.findOne( { where: {email} })

//         if(!user) return res.render("session/forgot-password", {
//             user: req.body,
//             error: "E-mail não cadastrado!"
//         })

//         req.user = user

//         next()

//     }
//     catch (err) {
//         console.error(err)
//     }

// }

// async function reset(req, res, next) {
//     // procurar o usuario
//     const { email, password, token, passwordRepeat } = req.body

//     const user = await User.findOne({ where: {email} })

//     if(!user) return res.render("session/password-reset", {
//         user: req.body,
//         token,
//         error: "Usuário não encontrado!"
//     })

//     // ver se a senha bate
//     if (password != passwordRepeat)
//         return res.render('session/password-reset', {
//             user: req.body,
//             token,
//             error: "Senhas digitadas não conferem"
//         })

//     // verfificar se o token bate
//     if (token != user.reset_token) return res.render('session/password-reset', {
//         user: req.body,
//         token,
//         error: "Token inválido! Solicite uma nova recuperação de senha." 
//     })

//     // verificar se o token não expirou
//     let now = new Date()
//     now = now.setHours(now.getHours())

//     if (now > user.reset_token_expires) return res.render('session/password-reset', {
//         user: req.body,
//         token,
//         error: "Token expirado. Por favor, solicite uma nova recuperação de senha." 
//     })

//     req.user = user
//     next()
// }

module.exports = {
    login,
    // forgot,
    // reset
}