const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./Database/database.js')


app.set('view engine','ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


connection.
    authenticate()
    .then(()=>{
        console.log('conectado com sucesso');
    }).catch((e)=>{
        console.log('conexão falhou');
    });

app.get("/",(req,res) =>{
    res.render('index')
})


app.listen(8080, ()=>{
    console.log("servior rodando na porta 8080"); 
});
