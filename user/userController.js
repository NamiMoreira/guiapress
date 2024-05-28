const express = require('express');
const router = express.Router();
const User = require("./User")
const bcrypt = require('bcryptjs')

router.get("/admin/users",(req,res) => {
    if (req.session.user == undefined) {
        res.redirect("/")
    }
    User.findAll().then(users => { 
        res.render("admin/user/index",{users: users})
    })
});
router.get("/admin/users/create",(req,res) => {
    res.render('./admin/user/users');
});

router.post("/admin/users/save",(req,res) => {
    var email = req.body.email;
    var password = req.body.password;
    
    User.findOne({
         where: {
         email: email}})
         
         .then(user => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password,salt)
        
            User.create({
                email: email,
                password: hash
                
            }).then(() => {
                res.redirect("/admin/users")
            }).catch(err =>{
                res.redirect('/admin/users')
            })  
        }else{
            res.redirect('/admin/users/create')
        }
    })
});

router.get('/login',(req,res) => {
    res.render("admin/user/login")
});

router.post("/authenticate",(req,res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user != undefined) {
            var correct = bcrypt.compareSync(password,user.password)
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            }else{
                res.redirect("/login")
            }
        }else{
            res.redirect("/login")
        }
    })

})

module.exports = router;