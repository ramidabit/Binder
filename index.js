const express = require('express');
const firebase = require('firebase');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const {addCourse, addStudent} = require('./courses');

const PORT = process.env.PORT || 5000;

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '1025752008731-9m28dve3ufam91gngdavvfsjefvr87db.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const serviceAccount = JSON.parse(fs.readFileSync('binder-52ad0-firebase-adminsdk-kt0pi-78e147356f.json'));
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

let app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
   res.render('login');
});

app.get('/login', (req,res)=>{
   res.render('login');
});

app.post('/login',  (req,res)=>{
   let token = req.body.token;
   async function verify() {
       const ticket = await client.verifyIdToken({
           idToken: token,
           audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
       });
       const payload = ticket.getPayload();
       const userid = payload['sub'];
     }
     verify()
     .then(()=>{
         res.cookie('session-token', token);
         res.send('success')
     })
     .catch(console.error);
});
app.get('/logout', (req, res)=>{

   res.clearCookie('session-token');
   res.redirect('/login')

});
app.get('/page', checkAuthenticated, (req, res) => {
   let user = req.user;
   res.render('page', {user});
});


function checkAuthenticated(req, res, next){

   let token = req.cookies['session-token'];

   let user = {};
   async function verify() {
       const ticket = await client.verifyIdToken({
           idToken: token,
           audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
       });
       const payload = ticket.getPayload();
       user.name = payload.name;
       user.email = payload.email;
       user.picture = payload.picture;
       db.collection('users').doc(user.email).set({
           name: user.name,
           email: user.email,
           course: null
       }).catch((error) => {
           console.error('Error creating document', error);
       });
     }
     verify()
     .then(()=>{
         req.user = user;
         next();
     })
     .catch(err=>{
         res.redirect('/login')
     });

};


app.listen(PORT);
