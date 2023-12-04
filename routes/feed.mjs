import express from 'express';
let router = express.Router();
import {client} from './../mongodb.mjs';
const db = client.db("crudop");
const col = db.collection("posts");

router.get('/feeds', async (req, res, next) => {
    console.log('Get all feeds!', new Date());
    const cursor = col.aggregate([{
        $lookup: {
            from: "users", // users collection name
            localField: 'author_id',
            foreignField: '_id',
            as: 'authorObject'
        },
    },
    {
        $unwind: {
            path: '$authorObject',
            preserveNullAndEmptyArrays: true, // Include documents with null authorId
        },
    },
    {
        $project: {
            _id: 1,
            text: 1,
            title: 1,
            createdAt: 1,
            img:1,
            author_id:1,
            likes: { $ifNull: ['$likes', []] },
            authorObject: {
                firstName: '$authorObject.firstName',
                lastName: '$authorObject.lastName',
                email: '$authorObject.email'
            }
        },
    },
    {
        $skip: 0,
    },
    {
        $limit: 100,
    },
    {
        $sort: { _id: -1 }
    },
    ])
    try{
        let results = await cursor.toArray();
        console.log("results: ", results);
        res.send(results);
    }catch(e){
        console.log("Error in Mongodb ", e);
        res.status(500).send({message: "Server Error. Try again later!"})
    }
})


export default router