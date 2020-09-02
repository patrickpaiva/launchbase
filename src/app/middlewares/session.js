const User = require("../models/User")

function onlyUsers(req, res, next) {
    if(!req.session.userId)
        return res.redirect('/users/login')
    next()
}

function isLoggedRedirectToUsers(req, res, next) {
    if (req.session.userId)
        return res.redirect('/users/admin/profile')

        next()
}

async function isAdmin(req, res, next) {
    const id = req.session.userId
    const user = await User.findOne({ where: {id} })

    if (!user.is_admin) {
        return res.send('Access Denied')
    }

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers,
    isAdmin
}