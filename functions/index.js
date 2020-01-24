const functions = require('firebase-functions');
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const express =  require('express');
const app = express();

var serviceAccount = require("./owldevs-sdk-key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://owldevs-8ecbc.firebaseio.com"
});

// admin.initializeApp();

app.get('/posts', (req, res) =>{
    admin
    .firestore()
    .collection('post')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
        let posts = [];
        data.forEach((doc) => {
            posts.push({
                postId: doc.id,
                body: doc.data().body,
                user: doc.data().user,
                createdAt: doc.data().createdAt
            });
        });
        return res.json(posts);
    })
    .catch(err => console.log(err));
})

app.post('post', (req, res) => {
    const newPost = {
        body: req.body.body,
        user: req.body.user,
        createdAt: new Date().toISOString()
    }

    admin.firestore()
        .collection('post')
        .add(newPost)
        .then((post) => {
            // res.json({message: 'asdfasfd'});
            res.json({ message: `post ${post.id} created` });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
            console.log(err);
        })
});

exports.api = functions.https.onRequest(app);