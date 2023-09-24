const express = require('express');
const SerialPort = require('serialport');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;
const arduinoPort = 'COM3'; // Sesuaikan dengan port Arduino Anda

const arduino = new SerialPort(arduinoPort, { baudRate: 9600 });

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('toggle', (state) => {
    arduino.write(state, (err) => {
      if (err) {
        console.error('Error writing to Arduino:', err.message);
        socket.emit('result', 'Error writing to Arduino');
      } else {
        console.log(`Toggled LED: ${state === '1' ? 'ON' : 'OFF'}`);
        socket.emit('result', `Sekarang lampu sedang: ${state === '1' ? 'ON' : 'OFF'}`);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Handle errors from Arduino
arduino.on('error', (err) => {
  console.error('Arduino error:', err.message);
});
