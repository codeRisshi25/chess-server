const express = require("express");
const app = express();
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

// import the model
const Game = require("./Model/model")

app.use(cors({ origin: "http://localhost:3000" }));

const server = http.createServer(app);
let games = {};
let players = {};
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// initialize the database 
mongoose
    .connect("mongodb+srv://risshi:root@main.vhznp.mongodb.net/chessDB?retryWrites=true&w=majority")
    .then(()=>console.log("MongoDB connected...."))
    .catch((error)=>console.log(error));


io.on("connection",(socket)=>{
  console.log("user connected")
  socket.on("create-game", async(nickName)=>{
    console.log(nickName);
    try {
      let game = new Game();
      const gameID = uuidv4();
      game.gamecode = gameID;
      let player = {
        nickName : nickName,
        socketID : socket.id,
      }
      game.players.push(player);
      await game.save();
      socket.join(gameID);
      socket.emit('update-game',game);

    } catch(error){
      console.log(error);
    }
  })
  socket.on("disconnect",()=>{
    console.log("user disconnected");
  })
});
const PORT = 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
