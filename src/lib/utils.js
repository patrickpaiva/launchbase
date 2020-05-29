module.exports = {
    age(timestamp) {
        const today = new Date()
        const birthDate = new Date(timestamp)
    
        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()
    
        if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
            age = age - 1
        }
    
        return age
    },
    date(timestamp) {
        const date = new Date(timestamp)

        const year = date.getFullYear()
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)
        const hour = date.getHours()
        const minutes = date.getMinutes()

        return {
            day,
            month,
            year,
            hour,
            minutes,
            birthDay: `${day}/${month}`,
            iso: `${year}-${month}-${day}`,
            format: `${day}/${month}/${year}`
        }
    }
}