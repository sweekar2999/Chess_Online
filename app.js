const express = require('express')
const http=require('http')
const socketio=require('socket.io')
const path=require('path');
const app = express()
const server = http.createServer(app);
const io = socketio(server);
const { Chess } = require('chess.js');


const chess = new Chess()
let players={}
let currentPlayer="w";


app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get('/', function (req, res) {
  res.render('index',{title:"Chess"})
})

io.on('connection',(uniquesocket)=>{
    console.log("New Connection");
    if(!players.white){
        players.white=uniquesocket.id;
        uniquesocket.emit("playerRole","w");
    }
    else if(!players.black){
        players.black=uniquesocket.id;
        uniquesocket.emit("playerRole","b");

    }
    else{
        uniquesocket.emit("spectatorRole");
    }
    uniquesocket.on("disconnect",()=>{
        if(uniquesocket.id===players.white){
            delete players.white;
        }
        else if(uniquesocket.id===players.black){
            delete players.black;
        }
    })
    uniquesocket.on("move",(move)=>{
        try{
            if(chess.turn()==="w" && uniquesocket.id!==players.white){
                return;
            }
            if(chess.turn()==="b" && uniquesocket.id!==players.black){
                return;
            }
            const result=chess.move(move); 
            if(result){
                currentPlayer=chess.turn();
                io.emit("move",move);
                io.emit("boardState",)
            }
        }
        catch(err){

        }
       
    })
})

server.listen(3000,()=>{
    console.log("Connected to port 3000")
})