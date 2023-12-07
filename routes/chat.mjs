import express from 'express';
import { client } from './../mongodb.mjs'
import { ObjectId } from 'mongodb'
import multer from 'multer';
import { globalIoObject, socketUsers } from '../core.mjs';

const db = client.db("crudop");
const messagesCollection = db.collection("messages");

let router = express.Router()
//posting message 
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
        const newMessage = {

            fromName: req.currentUser.firstName + " " + req.currentUser.lastName,
            fromEmail: req.currentUser.email,
            from_id: new ObjectId(req.currentUser._id),
            to_id: new ObjectId(req.body.to_id),
            messageText: req.body.message,
            createdOn: new Date()
        };
        const insertResponse = await messagesCollection.insertOne(newMessage);
        console.log("insertResponse: ", insertResponse);
        newMessage._id = insertResponse.insertedId;

        if(socketUsers[req.body.to_id]){
            socketUsers[req.body.to_id].emit('newMessage', newMessage);
            socketUsers[req.body.to_id].emit(`Notifications`, `New Message from ${req.currentUser.firstName}: ${req.body.message}`);
        }else{
            console.log("This User is not Online!")
        }

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
        res.send(results);
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
});
export default router