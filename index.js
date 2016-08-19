//External dependences
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = '3000';
server.listen(port);
var fs = require('fs'),
    request = require('request');
var path = require('path');
var bodyParser = require('body-parser');
var SpotifyWebHelper = require('@jonny/spotify-web-helper');
var helper = new SpotifyWebHelper();
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({
    extended: false
}));


helper.player.on('ready', function () {
    helper.player.on('play', function () {});
    helper.player.on('pause', function () {});
    helper.player.on('end', function () {});
    helper.player.on('track-change', function (track) {});
    helper.player.on('error', function (err) {});
});




app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/' + "index.html"));
});
var numClients = 0;
var numConnections = 0;


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

    socket.on('songURI', function (data) {

        helper.player.play(data);
        setTimeout(function () {
            console.log(helper.status.track.track_resource.name + " By " + helper.status.track.artist_resource.name);
        }, 1000);
        

    });


    socket.on('pause', function () {

        helper.player.pause();

    });



    socket.on('play', function () {

        helper.player.play();

    });

});
