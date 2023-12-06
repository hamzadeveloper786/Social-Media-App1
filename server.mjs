import express from 'express';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import './mongodb.mjs'
import { createServer } from 'http';
import { Server as socketIo } from 'socket.io';
import { globalIoObject, socketUsers } from './core.mjs'
import authRouter from './routes/auth.mjs'
import profileRouter from './routes/profile.mjs'
import feedRouter from './routes/feed.mjs'
import postRouter from './routes/post.mjs'
import userRouter from './routes/users.mjs'
import chatRouter from './routes/chat.mjs'

const __dirname = path.resolve();
const app = express();
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", authRouter)


app.use("/api/v1" ,(req, res, next) => {
    const token = req.cookies.token;
    try{
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log("decoded: ", decoded);
        {
            req.body.decoded = {
                _id: decoded._id,
                isAdmin: decoded.isAdmin,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                email: decoded.email,
            }
        }
        req.currentUser = {
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
            _id: decoded._id,
        };

    next();
}
        catch(e){
            res.status(401).send({ message: "Invalid token" })
        }
    })
    
    
    app.use("/api/v1", postRouter)
    app.use("/api/v1", profileRouter)
    app.use("/api/v1", feedRouter)
    app.use("/api/v1", userRouter)
    app.use("/api/v1", chatRouter)

app.use('/', express.static(path.join(__dirname, './web/build')))
app.get('*', (req, res, next)=>{
    res.sendFile(path.join(__dirname, './web/build/index.html'))
})

// THIS IS THE ACTUAL SERVER WHICH IS RUNNING
const server = createServer(app);
// handing over server access to socket.io
const io = new socketIo(server, {
    cors: {
        origin: ["*", "http://localhost:3000"],
        methods: "*",
        credentials: true
    }
});
globalIoObject.io = io;
io.use((socket, next) => {
    console.log("socket middleware");
    // Access cookies, including secure cookies
    const parsedCookies = cookie.parse(socket.request.headers.cookie || "");
    console.log("parsedCookies: ", parsedCookies.token);
    try {
        const decoded = jwt.verify(parsedCookies.token, process.env.SECRET);
        console.log("decoded: ", decoded);
        socketUsers[decoded._id] = socket;
        socket.on("disconnect", (reason, desc) => {
            console.log("disconnect event: ", reason, desc); // "ping timeout"
        });
        next();
    } catch (err) {
        return next(new Error('Authentication error'));
    }
});
io.on("connection", (socket) => {
    console.log("New client connected with id: ", socket.id);

})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Example server listening on port ${PORT}`)
})
