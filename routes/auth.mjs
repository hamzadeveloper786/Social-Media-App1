import express from 'express';
import { client } from '../mongodb.mjs';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { stringToHash, verifyHash, validateHash } from "bcrypt-inzi";
const userCollection = client.db("crudop").collection("users");
const otpCollection = client.db("crudop").collection("otpCodes");
let router = express.Router();

router.post('/login', async (req, res, next) => {
    if (!req.body?.email || !req.body?.password) {
        res.status(403).send(`Required paramater missing
        Example request body:{
            email:"abc@gmail.com",
            password:"********",
        }`);
        return;
    };
    req.body.email = req.body.email.toLowerCase();
    try {
        let result = await userCollection.findOne({ email: req.body.email });
        if (!result) {
            res.status(401).send({ message: ("Email or Pasword Incorrect!") })
            return;
        } else {
            const isMatch = await verifyHash(req.body.password, result.password);
            if (isMatch == true) {
                const token = jwt.sign({
                    isAdmin: result.isAdmin,
                    _id: result._id,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: req.body.email,
                },
                    process.env.SECRET,{
                        expiresIn: '24h',
                    });

                res.cookie('token', token,
                    {
                        httpOnly: true,
                        secure: true,
                        expires: new Date(Date.now() + 86400000)
                    });
                res.status(200).send({ message: "Login Successful!" ,
                data:{
                    isAdmin: result.isAdmin,
                    _id: result._id,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: req.body.email,
            }
        })
               return;
            } else {
                res.status(401).send({ message: ("Email or Password Incorrect!") })
                return;
            }

        }
    }
    catch (e) {
        console.log("Error in Mongodb ", e);
        res.status(500).send("Server Error. Try again later!")
    }
})
router.post('/logout', async (req, res, next) =>{
    res.clearCookie('token');
    res.status(200).send({message: "Logout Successfully!"});
    return;
})
router.post('/signup', async (req, res, next) => {
    if (!req.body?.firstName || !req.body?.lastName || !req.body?.email || !req.body?.password) {
        res.status(403).send(`Required paramater missing
        Example request body:{
            firstName:"First Name",
            lastName:"Last Name",
            email:"abc@gmail.com",
            password:"********",
        }`);
        return;
    };

    req.body.email = req.body.email.toLowerCase();
    req.body.firstName = req.body.firstName.toUpperCase();
    req.body.lastName = req.body.lastName.toUpperCase();

    try {
        let results = await userCollection.findOne({ email: req.body.email });
        console.log("results ", results);
        if (!results) {

            const passwordHash = await stringToHash(req.body.password);


            const insertResponse = await userCollection.insertOne({
                isAdmin: false,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: passwordHash,
                createdAt: moment().format('llll'),
            });
            console.log("Insert Response  ", insertResponse);
            res.status(200).send({ message: ('User created successfully!') });
        } else {
            res.status(403).send({message:("User already exists with email!")});
        }
    } catch (e) {
        console.log("Error in Mongodb ", e);
        res.status(500).send("Server Error. Try again later!")
    }
})
router.post(`/forget-pass`, async(req, res, next) =>{
    if(!req.body?.email){
        res.status(403).send(`required parameters missing, example request body: {email: "some@email.com"}`)
        return;
}
req.body.email = req.body.email.toLowerCase();
try{
    const user = await userCollection.findOne({email: req.body.email});
    if(!user){
        res.status(403).send({message: "User not found!"});
        return;
    }
}
catch{}
})

export default router