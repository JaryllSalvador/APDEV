const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/logindb').catch(error => {throw error});

server.get('/', (req, res) => {
    res.render('main',{
        layout: 'index'
      });
})

server.get('/homepage', (req, res) => {
    res.render('main',{
        layout: 'homepage'
      });
})

server.get('/profile', (req, res) => {
    res.render('main',{
        layout: 'profile'
      });
})

server.get('/reserve_seat', (req, res) => {
    res.render('main',{
        layout: 'reserve_seat'
      });
})

const port = process.env.PORT | 9090;
server.listen(port, function(){
    console.log('Listening at port '+port);
});
