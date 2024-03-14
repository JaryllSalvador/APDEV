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
        user : req.query.user,
        layout: 'homepage'
    });
})

const Profile = require('./profile');
server.get('/profile', async (req, res) => {
    try {

        const user = req.query.user
        console.log(user)
        const profile = await Profile.findOne({account_name : user}).exec();
        res.render('main', { layout: 'profile', user: user, display_name: profile.display_name ,account_name:profile.account_name ,profile_email:profile.profile_email, admin_access:profile.admin_access, student_access:profile.student_access,profile_picture:profile.profile_picture });

    } catch (err) {
        console.error('Error retrieving user profile:', err);
        res.status(500).send('Error retrieving user profile');
    }
});

server.get('/search', async (req, res) => {
    try {

        const user = req.query.user
        console.log(user)
        const profile = await Profile.findOne({account_name : req.query.profile}).exec();
        res.render('search', { layout: 'profile', profile: req.query.profile, user: user, display_name: profile.display_name ,account_name:profile.account_name ,profile_email:profile.profile_email, admin_access:profile.admin_access, student_access:profile.student_access,profile_picture:profile.profile_picture });

    } catch (err) {
        console.error('Error retrieving user profile:', err);
        res.status(500).send('Error retrieving user profile');
    }
});


server.get('/reserve_seat', (req, res) => {
    res.render('main',{
        user : req.query.user,
        layout: 'reserve_seat'
    });
})


server.get('/editprofile', async (req, res) => {
    try {

        const user = req.query.user
        console.log(user)
        const profile = await Profile.findOne({account_name: user}).exec();
        res.render('main', {
            layout: 'editprofile',
            user: user,
            display_name: profile.display_name,
            account_name: profile.account_name,
            profile_email: profile.profile_email,
            admin_access: profile.admin_access,
            student_access: profile.student_access,
            profile_picture: profile.profile_picture
        });

    } catch (err) {
        console.error('Error retrieving user profile:', err);
        res.status(500).send('Error retrieving user profile');
    }
})
const port = process.env.PORT | 9090;
server.listen(port, function(){
    console.log('Listening at port '+port);
});