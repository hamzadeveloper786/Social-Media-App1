import express from 'express';
import { client } from './../mongodb.mjs'
import { ObjectId } from 'mongodb'
import multer, { diskStorage } from 'multer';
const db = client.db("crudop");
const messagesCollection = db.collection("messages");
let router = express.Router()
router.post("/message", multer().none(), async (req, res, next) => {

    console.log("req.body: ", req.body);
    console.log("req.currentUser: ", req.currentUser);

    if (!req.body.to_id || !req.body.message) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            to_id: "43532452453565645635345",
            messageText: "some post text"
        } `);
        return;
    }

    if (!ObjectId.isValid(req.body.to_id)) {
        res.status(403).send(`Invalid user id`);
        return;
    }

    try {
        const insertResponse = await messagesCollection.insertOne({

            fromName: req.currentUser.firstName + " " + req.currentUser.lastName,
            fromEamil: req.currentUser.email,
            from_id: new ObjectId(req.currentUser._id),
            to_id: new ObjectId(req.body.to_id),
            messageText: req.body.message,
            imgUrl: req.body.imgUrl,
            createdOn: new Date()
        });
        console.log("insertResponse: ", insertResponse);
        res.send({ message: 'message sent' });
    } catch (e) {
        console.log("error sending message mongodb: ", e);
        res.status(500).send({ message: 'server error, please try later' });
    }
});
//getting a messages
router.get("/messages/:from_id", async (req, res, next) => {

    if (!req.params.from_id) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            from_id: "43532452453565645635345"
        } `);
    }

    if (!ObjectId.isValid(req.params.from_id)) {
        res.status(403).send(`Invalid user id`);
        return;
    }
    const cursor = messagesCollection.find({
        $or: [
            {
                to_id: new ObjectId(req.currentUser._id),
                from_id: new ObjectId(req.params.from_id),
            }
            ,
            {
                from_id: new ObjectId(req.currentUser._id),
                to_id: new ObjectId(req.params.from_id)
            }
        ]
    })
        .limit(100);
    try {
        let results = await cursor.toArray()
        console.log("results: ", results);
        res.send(results);
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
});
export default router