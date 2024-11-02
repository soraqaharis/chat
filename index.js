import express from 'express';
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors';
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true
  }
})
const port = process.env.PORT || 4000


// app.use(cookieParser())
// app.use(express.json())
app.use(cors({
  origin:'*',
  methods: ["POST", "GET"],
  credentials: true
}))
const users = {}

io.on("connection", (socket) => {
  console.log(`User ${socket.id}`)
  socket.on('set_user', (senderId)=>{
    users[senderId] = socket.id
    console.log(users)
    console.log(`${senderId} connected with ${socket.id}`)
  })
  socket.on('send_private_message', ({message, senderId, receiverId})=>{
    const receiverSocketId = users[receiverId]
 console.log()
    if(receiverSocketId){
      io.to(receiverSocketId).emit('rec_message', {message, senderId})
    }else{
      console.log(`Receiver ${receiverId} is not connected`); 
    }
    console.log(`Message from ${senderId} to ${receiverId} ${message}`)
  })
 
});
console.log(users)

// app.use(router)

app.get('/', (req, res) => {
  res.send('Hello from server')
})

server.listen(port, ()=> {
  console.log(`app is listening at port no ${port}`)
  // DBConnection()
})


