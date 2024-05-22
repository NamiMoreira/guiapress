const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./Database/database.js')

const Article = require('./articles/Articles.js');
const Category = require("./categories/Category.js");

const categoriesController = require("./categories/CategoriesController.js");
const articlesController = require("./articles/ArticlesController.js");


app.set('view engine','ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/",categoriesController);
app.use("/",articlesController);

connection.
    authenticate()
    .then(()=>{
        console.log('conectado com sucesso');
    }).catch((e)=>{
        console.log('conexão falhou');
    });

app.get("/",(req,res) =>{

    Article.findAll({
        order:[ [ "id","DESC"] ]
    }).then((articles => {
        Category.findAll().then(categories =>{
            res.render('index', {articles: articles, categories: categories})
        })
     }))
});

app.get("/:slug",(req,res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then((articles => {   
       if(articles != undefined) {
            res.render('article', {articles: articles})
       }else{
        res.redirect("/");
       }
        
    })).catch(err => {
        res.redirect("/");
    })
});

app.get("/category/:slug",(req,res) =>{
    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
            include: [{model: Article}] 
    }).then( category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render('index',{categories: categories , articles: category.articles});
            })
        }else{
            res.redirect('/');
        }
    }).catch(err => {
            res.redirect('/');
    })
});


app.listen(8080, ()=>{
    console.log("servior rodando na porta 8080"); 
});
