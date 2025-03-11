const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const favicon = require('serve-favicon');
const socketio = require('socket.io')(http);
const cp = require('child_process');


app.use(express.static(path.join(__dirname, 'static')));
app.use(favicon(path.join(__dirname, 'static', 'images', 'favicon.ico')));

http.listen(process.env.PORT || 5000, () => {
  console.log(`Server running at 127.0.0.1:${process.env.port || 5000}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
});
// 
socketio.on('connection', (socket) => {
  socket.on('message', (msg) => {
    if (msg.trim() === '/date') {
      const child = spawn('date', []);
  
      child.stdout.on('data', (data) => {
        socket.emit('message', data.toString());
      });
  
      child.stderr.on('data', (data) => {
        socket.emit('message', 'Erreur : ' + data.toString());
      });
    } else {
      socket.emit('message', msg);
    }
  });
});
