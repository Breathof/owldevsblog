const functions = require('firebase-functions');
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const express =  require('express');
const app = express();

var serviceAccount = require(".owldevs-sdk-key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://owldevs-8ecbc.firebaseio.com"
});

// admin.initializeApp();

app.get('/posts', (req, res) =>{
    admin.firestore().collection('post').get()
    .then((data) => {
        let posts = [];
        data.forEach((doc) => {
            posts.push(doc.data());
        });
        return res.json(posts);
    })
    .catch(err => console.log(err));
})

app.post('post', (req, res) => {
    const newPost = {
        body: req.body.body,
        user: req.body.user,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
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