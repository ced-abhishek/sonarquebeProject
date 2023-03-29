  const express = require("express");
  // const express = require("https://unpkg.com/express@5.0.0-beta.1/index.js");
  // const bodyparser = require("https://cdn.jsdelivr.net/npm/body-parser@1.20.2/lib/types/raw.min.js");
  const bodyparser = require("body-parser");
  var path = require('path');
  const cors = require('cors');

  PORT = 5055;


  app = express();
  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({extended: false}))
  app.use(express.static(path.join(__dirname,'./client/public')));
  // app.use(express.static(path.join('./client/public')));

  app.use(
    cors({
      origin: "*",
    })
  );

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
  });

  const server = app.listen(PORT, () => {
      console.log("Listening on port: " + PORT);
  });
  const { Server } = require("socket.io");
  const io = new Server(server);
  // const io = require('socket.io')(server);
  // const io = require('https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.1/socket.io.js')(server);



  {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.1/socket.io.js" integrity="sha512-xbQU0+iHqhVt7VIXi6vBJKPh3IQBF5B84sSHdjKiSccyX/1ZI7Vnkt2/8y8uruj63/DVmCxfUNohPNruthTEQA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script> */}

  app.get('/', (req, res) => {
      res.sendFile(__dirname + '/client/public/index.html');
      // res.sendFile('./client/public/index.html');
    });
    
    
    var name;
    
    io.on('connection', (socket) => {
      console.log('new user connected');
      
      socket.on('joining msg', (username) => {
          name = username;
          io.emit('chat message', `---${name} joined the chat---`);
          console.log(`${name} user connected`);
      });
      
      socket.on('disconnect', () => {
        console.log(`${name} user disconnected`);
        io.emit('chat message', `---${name} left the chat---`);
        
      });
      socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
      });
    });