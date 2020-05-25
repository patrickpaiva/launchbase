const Recipe = require('../models/recipe')
const Chef = require('../models/chef')
const { date } = require('../../lib/utils')

module.exports = {
    index(req, res) {

        Chef.allChefs(function(chefs){
            return res.render("index", {chefs})

        })

    },
    about(req, res) {
        return res.render("about")
    },
    showAll(req, res) {
        Chef.allChefs(function(chefs){
            return res.render("chefs", {chefs})

        })
    },
    show(req, res) {
        Chef.find(req.params.id, function(chef) {

            Chef.findChefsRecipes(req.params.id, function(recipes){

                return res.render("chef", { chef, recipes })
            })
            
        })
    },
    admchef(req, res) {
        Chef.find(req.params.id, function(chef) {

            Chef.findChefsRecipes(req.params.id, function(recipes){

                return res.render("admin/chefs/chef-admpanel", { chef, recipes })
            })
            
        })
    },
    admpanel(req, res) {
        Chef.allChefs(function(chefs){
            return res.render("admin/chefs/adm-panel", {chefs})

        })
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields')
            }
        }
    
        Chef.create(req.body, function(){
            return res.redirect(`/admin/chefs`)
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields')
            }
        }

             
        Chef.update(req.body, function(){
            return res.redirect(`/admin/chefs`)
        })
    },
    edit(req, res) {
        Chef.find(req.params.id, function(chef){
            return res.render(`admin/chefs/edit`, { chef })
        })
    },
    delete(req, res) {
        Chef.delete(req.body.id, function(){
            return res.redirect('/admin/chefs')
        })
    }
}