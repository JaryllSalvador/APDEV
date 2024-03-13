const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(bodyParser.json()); 
server.use(bodyParser.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

const login = require('./login.js')
server.use('/login', login);

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
