import express from 'express';
import { ObjectId } from 'mongodb';
import { client } from './../mongodb.mjs';
import admin from "firebase-admin";
import multer, { diskStorage } from 'multer';
import fs from "fs";

const db = client.db("crudop");
const col = db.collection("posts");
let router = express.Router()

//==============================================
const storageConfig = diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {
        console.log("mul-file: ", file);
        cb(null, `postImg-${new Date().getTime()}-${file.originalname}`)
    }
})
let upload = multer({ storage: storageConfig })
//==============================================

// https://firebase.google.com/docs/storage/admin/start
let serviceAccount = {
    "type": "service_account",
    "project_id": "react-crud-app1",
    "private_key_id": "a85d6da65d93355561dad0ec2cb5f9a7150a3b0f",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDbGwdFtxM9e0DM\nIE+3qi1jAJiZTqJ73NyF6IZNgxdUiqTKn5tHSiYnx3ctP5gVa/MWOwNOEJnmFgbK\nEL2Di8z3kDANdJKg6+tR+kljSWKFiGlT0sbYEsIcOBm1yazWSzauwSZAwoE3VzFv\nfTcy64OpFasEXBa9AlhwfWe6NUo41ik3pqmgeLy7DFAhlo1HaTStMyDtx1yLJO20\nBx3z7fSifIWhhDnILlb90PAW3CBmf2Pgxru4Xxa0K8EZWFdnsQyVUNQnpuClTKNl\n9mVfWOEKZEL5xb9FLfCipbhJVPk2HT8hbzKPR1pfOlJseugcnrT4/nkQAxVnWDs+\nuh4da/dHAgMBAAECggEAWgIb9jEzl7Wq1FBPv0ELHRkRFyWdDSoZc28mwO/h5SqB\ncPWpOduFmiDQXge6Z85tUYwTmv2p40HYLyk6WTBUlrymaNijJbVU+dvKSx3J+dYk\ngrlbU0c9c48+TJYZSP0j7R1OpBrjL0ND/StgwivK7eqHUyardqDgiPGTa4TZxUe+\nhEfTzi0zeMKOJlHLKoxFQe7FLAszdJ/+g3qqk0O7n9cXRXNPB68W0f4prJFNuZQc\n+9nv/k7hFG/3gEJMHuUmXaklpJzbVSUvX1FXf2mCrJ23mTvv99ACPUsgCwM1nrmY\n0S5zyIoTyzAjg0VxQa93w223Vt1gUOjRSpOWmgDVsQKBgQDzkQ3z7qnw/SB7cJCs\nazbLsUwHvU6X+tfoWlIUHQ3gA1cKC4iPLYlSS5gcuNGGXDjbu7sOlGHQwyN8iPPG\n4sdzLuifK6IUTcn7+6f5YngNZRbZDqQgS8bnOiw1QktWAuMkg4acvU0xRakikRbD\nQgWOWDG8Wm9Hq7/usZQz9kmSlwKBgQDmSlC6PV43Hr56xeBRnxgYrjJebePf6tWa\nh3KLBX+oanYEKi5rcS4yV59d3+52ZJKHtSgXDAdIQjfAH6ihJfDne67NTswhlU7H\nV0gwydvbiqLVcu0By+rgG86DJ5CUfGPil94u1xvGkUJtuNFVPPM7liGP+EA3DJz4\nfqrZs6pG0QKBgQCST2haR9u979A7VnsRl7Xq1i4d2BIGKaDY6qizfGCBWIBIgHUf\nzPLYhKBzYHI8i9l75WGQeIHprc77WClYJ5I4Fs2WD9fk6nWS8LEOlaAYK8l1yd29\nqMdqzv8PXytyF3nqzTdnoC9mkbnwEcfisx4zS7dUtd5y5zD8aZ/lNuUrMQKBgQCo\nY7TNyavHoDpl6aTR6gQjn9SCydWzWLKiEOKHlxi2XEo5V2Kj+5ltBDcq3GAwv++J\nPcS3vXrhslGzsTKLywNxMDYsN67564Q0LLVDv4Z87M2OSD/XbXUsNAj4TAjjGmWr\nPaMgGvhbZMHvGxIuQqgUbP3TmRHTbuyko3JoR4B90QKBgEFAJH43zTuI7nJDOvkD\nUhN1zwq5SYqziurjUMT4K7ZhFVEOG45OZMsLtv+ZCCBz7B1MfjD0Rft2KGXKkydo\nP3egP7Ofb4Amr+eWrGOvT6XBEe7BjTZ5u6hDkPrTWEqOc6XxPmVKY1w+Ursuqzd8\nSRodTJkcARjSbP6NiNX1CCCF\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-hf0fx@react-crud-app1.iam.gserviceaccount.com",
    "client_id": "110300209892691947755",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hf0fx%40react-crud-app1.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const bucket = admin.storage().bucket("gs://react-crud-app1.appspot.com");

//==============================================
//create a post
router.post('/post', async (req, res, next) => {
    req.decoded = { ...req.body.decoded }
    next();
},
    upload.any(),
    async (req, res, next) => {
        console.log('Create a Post!', new Date());

        if (!req.body.title || !req.body.text) {
            res.status(403).send({ message: `Required paramater missing` });
            return;
        };

        if (req.files && req.files[0]) {
            if (req.files[0].size > 5000000) { // size bytes, limit of 5MB
                res.status(403).send({ message: 'File size limit exceed, max limit 5MB' });
                return;
            }
            bucket.upload(
                req.files[0].path,
                {
                    destination: `posts/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
                },
                function (err, file, apiResponse) {
                    if (!err) {

                        // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                        file.getSignedUrl({
                            action: 'read',
                            expires: '03-09-2491'
                        }).then(async (urlData, err) => {
                            if (!err) {
                                console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                                try {
                                    const insertPost = await col.insertOne({
                                        title: req.body.title,
                                        text: req.body.text,
                                        img: urlData[0],
                                        author: req.decoded.firstName + " " + req.decoded.lastName,
                                        author_id: new ObjectId(req.decoded._id),
                                        createdAt: new Date(),
                                        likes: [],
                                    });
                                    res.status(200).send({
                                        message: 'Post created successfully!'
                                    });
                                }
                                catch (e) {
                                    console.log("Error in Mongodb ", e);
                                    res.status(500).send({ message: "Server Error. Try again later!" })
                                }
                                try {
                                    fs.unlinkSync(req.files[0].path)
                                    //file removed
                                } catch (err) {
                                    console.error(err)
                                }
                            }
                        })
                    } else {
                        console.log("err: ", err)
                        res.status(500).send({
                            message: "server error"
                        });
                    }
                });
        }
        else {
            try {
                const insertResponse = await col.insertOne({
                    title: req.body.title,
                    text: req.body.text,
                    author: req.decoded.firstName + " " + req.decoded.lastName,
                    author_id: new ObjectId(req.decoded._id),
                    createdAt: new Date(),
                    likes: [],
                });
                res.status(200).send({
                    message: 'Post created successfully!'
                });
            } catch (e) {
                console.log("error inserting mongodb: ", e);
                res.status(500).send({ message: 'server error, please try later' });
            }
        }

    })

//update a post
router.put('/post/:postId', async (req, res, next) => {
    const postId = new ObjectId(req.params.postId);
    const { title, text } = req.body;

    if (!title || !text) {
        res.status(403).send({ message: 'Required parameters missing. Please provide both "title" and "text".' });
        return;
    }

    try {
        const updateResponse = await col.updateOne({ _id: postId }, { $set: { title, text } });

        if (updateResponse.matchedCount === 1) {
            res.send({ message: `Post with id ${postId} updated successfully.` });
        } else {
            res.send({ message: 'Post not found with the given id.' });
        }
    } catch (error) {
        console.error(error);
    }
})
//delete a post
router.delete('/post/:postId', async (req, res, next) => {
    console.log('Finding a post!', new Date());
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send({ message: "Post id must be a valid number!!" });
        console.log({ message: "Post id doesnot match!" })
        return;
    }
    try {
        const deleteResponse = await col.deleteOne({ _id: new ObjectId(req.params.postId) });
        if (deleteResponse.deletedCount === 1) {
            res.send({ message: "Post deleted successfully!" });
            console.log({ message: `Post with id ${req.params.postId} deleted successfully.` })
        } else {
            console.log({ message: "Post not found with the given id." });
            res.status(500).status({ message: 'Server Error ! Try again later..' })
        }
    } catch (error) {
        console.error(error);
    }

});
//search a post
// router.get('/post/:postId', async(req, res, next) => {
//     console.log('Searching a post!', new Date());

//     if(ObjectId.isValid(req.params.postId)){
//         res.status(403).send({message: "Post id must be a valid number!!"});
//         console.log({message: "Post id doesnot match!"})
//         return;
//     }

//     try{
//         let search = await col.findOne({_id : new ObjectId(req.params.postId) });
//         console.log("Result : ", search);
//         res.send(search);
//     }catch(e){
//         console.log("Error in Mongodb ", e);
//         res.status(500).send({message: "Server Error. Try again later!"})
//     }
// })
router.get('/post/:postId', async (req, res, next) => {
    console.log('Searching a post!', new Date());

    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send({ message: "Post id must be a valid number!!" });
        console.log({ message: "Post id does not match!" })
        return;
    }

    try {
        let search = await col.findOne({ _id: new ObjectId(req.params.postId) });
        console.log("Result : ", search);
        res.send(search);
    } catch (e) {
        console.log("Error in Mongodb ", e);
        res.status(500).send({ message: "Server Error. Try again later!" })
    }
})

//Delete all posts
router.delete('/posts/all', async (req, res, next) => {
    try {
        const deleteResponse = await col.deleteMany({});
        if (deleteResponse.deletedCount > 0) {
            res.send({ message: `All posts deleted successfully!` });
        } else {
            res.send({ message: `No posts found to delete!` });
        }
    }
    catch (e) {
        console.log("Error in Mongodb ", e);
        res.status(500).send({ message: "Server Error. Try again later!" })
    };
});

//dolike function
router.post('/post/:postId/dolike', async (req, res, next) => {

    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send(`Invalid post id`);
        return;
    }
    try {
        const doLikeResponse = await col.updateOne(
            { _id: new ObjectId(req.params.postId) },
            {
                $addToSet: {
                    likes: new ObjectId(req.body.decoded._id)
                }
            }
        );
        console.log("doLikeResponse: ", doLikeResponse);
        res.send('like done');
    } catch (e) {
        console.log("error like post mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})
export default router