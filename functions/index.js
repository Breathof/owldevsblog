const functions = require('firebase-functions');
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const express =  require('express');
const app = express();

var serviceAccount = require("../../owldevs-sdk-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://owldevs-8ecbc.firebaseio.com"
});

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.getPosts = functions.https.onRequest((req, res) => {
    admin.firestore().collection('post').get()
        .then((data) => {
            let posts = [];
            data.forEach((doc) => {
                posts.push(doc.data());
            });
            return res.json(posts);
        })
        .catch(err => console.log(err));
});

exports.createPost = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: 'Method not allawed' });
    }
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