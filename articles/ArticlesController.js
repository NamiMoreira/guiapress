const express = require ('express')
const router = express.Router();
const Category = require('../categories/Category');
const Article = require("./Articles");
const slugify = require("slugify")

router.get('/admin/articles',(req,res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then((articles => {
        res.render('admin/articles/index.ejs',{articles: articles, cont: false})
    }
    ))
});

router.get('/admin/articles/new',(req,res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new.ejs',{categories: categories})
    })
    
});
router.post("/articles/save",(req,res) =>{
        var title = req.body.title;
        var body = req.body.body;
        var category = req.body.category;

        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category

        }).then(() =>{
            res.redirect("/admin/articles")
        })
});

router.post("/articles/delete",(req,res) => {
    var id = req.body.id
    console.log(id);
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where:{
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        }else{
            res.redirect("/admin/articles")
        }
    }else{
        res.redirect("/admin/articles")
    }
});

router.get("/admin/articles/edit/:id",(req,res) => {
     var id = req.params.id;   
    
    Article.findOne({
            where: {
                id: id
            },
            include: [{model: Category}] 
        }).then(articles =>{
            Category.findAll().then(categories =>{
                res.render('./admin/articles/edit',{articles: articles, categories: categories})
            })
        })
});

router.post('/articles/update',(req,res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.categoryId;
    var id = req.body.id
    console.log(category + 'tenaomiste');
    Article.update({title: title, body: body, categoryId: category},{
            where: {
                id: id
            }
        }).then(() =>{
            Article.findAll({
                include: [{model: Category}]  
        }).then((articles => {
            res.render('./admin/articles/index.ejs',{articles: articles, cont: true})
        })) 
        }).catch((err => {
            res.redirect('/admin/articles');
        }))  
});

module.exports = router;