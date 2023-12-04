import express from 'express';
import {client} from './../mongodb.mjs';
const db = client.db("crudop");
const users = db.collection("users");
let router = express.Router();

router.get('/users', async (req, res) => {

    try{
        let result = await users.find().toArray();
        res.status(200).send(result);
    }catch(e){
        console.log("Server Error!", e)
        res.status(500).send({message: "Server Error!"});
    }
    
})
export default router;