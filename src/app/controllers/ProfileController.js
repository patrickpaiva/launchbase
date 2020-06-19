module.exports = {
    async index(req, res) {
        const { user } = req

        let userName = user.name
        userName = userName.split(' ')
        user.firstName = userName[0]
        
        return res.render('admin/users/profile', { user })
    }
}