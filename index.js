
//External dependences
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = '3000';
server.listen(port);
const fs = require('fs'),
    request = require('request');
const path = require('path');
const bodyParser = require('body-parser');
const SpotifyWebHelper = require('spotify-web-helper');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: false
}));


const helper = SpotifyWebHelper();

helper.player.on('error', err => {

  if (error.message.match(/No user logged in/)) {
    // also fires when Spotify client quits
    console.log("Spotify Closed/Not Open");
  } else {
    // other errors: /Cannot start Spotify/ and /Spotify is not installed/
    console.log("Cannot find Spotify");
  }
});


helper.player.on('ready', () => {

  // Playback events
  helper.player.on('play', () => { });
  helper.player.on('pause', () => { });
  helper.player.on('end', () => { });
  helper.player.on('track-will-change', track => {});
  helper.player.on('status-will-change', status => {});

});


//Express Routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/' + "index.html"));
});

//Connection Count
var numClients = 0;
var numConnections = 0;

//Socket IO Routes
io.on('connection', function (socket) {

    numClients++;
    numConnections++;
    console.log("Total Connections Since Last Reboot: " + numConnections);
    io.emit('stats', {
        numClients: numClients
    });
    console.log('Connected clients:', numClients);

    socket.on('disconnect', function () {
        numClients--;
        io.emit('stats', {
            numClients: numClients
        });
        console.log('Connected clients:', numClients);
    });

    //Play Song by URI
    socket.on('songURI', function (data) {
        helper.player.play(data);
        setTimeout(function () {
            console.log(helper.status.track.track_resource.name + " By " + helper.status.track.artist_resource.name);
        }, 1000);
    });

    //SPotify Pause
    socket.on('pause', function () {
        helper.player.pause();
    });

    //Spotify PLay
    socket.on('play', function () {
        helper.player.play();
    });
});

console.log("Server Started Successfully! :)")
