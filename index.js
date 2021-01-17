const express = require('express');
const firebase = require('firebase');
const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = JSON.parse(fs.readFileSync('binder-52ad0-firebase-adminsdk-kt0pi-4c4c056db4.json'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
  
const db = admin.firestore();


app = express();

app.get('/', (req, res) => {
    db.collection('users').add({
        name: 'Nandy',
        id: 69
    }).then((doc)=>{
        console.log('Document written with ID: ', doc.id);
    }).catch((error) => {
        console.error('Error creating document', error);
    }); 
    res.send('<h1>Waddup</h1>');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT);