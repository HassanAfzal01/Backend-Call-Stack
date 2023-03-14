const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();

var path = require('path');
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");

app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
},{allowEIO3: true});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// app.use("/peerjs", peerServer);
app.use(express.urlencoded({ extended: false }));
// app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));



// middleWare
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.get("/audio/:room", async(req, res) => {
  let check = await userModel.findOne({_id:req.user._id,connectionId:req.params.room}).lean().exec();
  let caller = await userModel.findOne({_id:{$ne:req.user._id},connectionId:req.params.room}).lean().exec();
  if(check){
    await userModel.findOneAndUpdate({_id:req.user._id,connectionId:req.params.room},{status:"OnAnotherCall"}).exec();
    return res.render("audio", { roomId: req.params.room ,name:req.user.firstName + " " + req.user.lastName,oId:req.user._id,callerName:caller.firstName + " " + caller.lastName,callerImage:caller.image});
  }
  else{
    return res.send("Connection not found");
  }
});

app.get("/v2/audio/:room", async(req, res) => {
  let check = await userModel.findOne({_id:req.user._id,connectionId:req.params.room}).lean().exec();
  let caller = await userModel.findOne({_id:{$ne:req.user._id},connectionId:req.params.room}).lean().exec();
  if(!caller){
    return res.status(500).json("Caller not defined");
  }
  if(check){
    await userModel.findOneAndUpdate({_id:req.user._id,connectionId:req.params.room},{status:"OnAnotherCall"}).exec();
    return res.render("audio", { roomId: req.params.room ,name:req.user.firstName + " " + req.user.lastName,oId:req.user._id,callerName:caller.firstName + " " + caller.lastName,callerImage:caller.image});
  }
  else{
    return res.status(500).json("Connection not found");
  }
});

io.on("connection", (socket) => {
  console.log("connect")

  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.on('ready',()=>{
      socket.broadcast.to(roomId).emit('user-connected',userId);
      })
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  })

  socket.on('disconnect', async () => {
    console.log("disconnect");
    let data=await userModel.findOne({socketId:socketId}).exec();
    if(data){
        await userModel.findOneAndUpdate({socketId:socketId},{socketId: null,status:"Offline"}).exec()
        const users = await userModel.find({$or:[{status: "Online"},{status: "OnAnotherCall"}]}).lean().exec();
        socket.broadcast.emit("user",{data:users})
        socket.emit("user",{data:users}) 
    }
  });
});

server.listen(process.env.PORT || 4050,()=>{console.log("listening on port")});
