const Sequelize = require('sequelize');

const conection = new Sequelize('guiapress', 'root','211309',{
    host: 'localhost',
    dialect: 'mysql'
});
module.exports = conection;