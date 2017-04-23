var socket = io.connect("/");
socket.on("stats", function(data) {
  console.log("Connected clients:", data.numClients);

  //var msg = new SpeechSynthesisUtterance('Welcome to spotify VR');

  //window.speechSynthesis.speak(msg);
});
(function() {
  function searchTracks(query) {
    $.ajax({
      url: "https://api.spotify.com/v1/search",
      data: {
        q: query,
        type: "track"
      },
      success: function(response) {
        if (response.tracks.items.length) {
          var track = response.tracks.items[0];
          socket.emit("songURI", track.uri);
          divVar =
            '<div class="card">' +
            "<img " +
            'src="' +
            track.album.images[1].url +
            '"' +
            ' alt="Avatar" style="width:100%" ><div class="cardContainer"><h4><b>Playing: ' +
            track.name +
            " by " +
            track.artists[0].name +
            "</b></h4> </div></div><br>";

          console.log(divVar);
          communicateAction(divVar);
        }
      }
    });
  }

  function playSong(songName, artistName) {
    var query = songName;
    if (artistName) {
      query += " artist:" + artistName;
    }
    searchTracks(query);
  }

  //Scroll Animation
  function scrollWin() {
    window.scrollTo(0, 1000);
  }

  //Annyang GUI Events
  function communicateAction(text) {
    var rec = document.getElementById("conversation");
    rec.innerHTML += text + "</div>";
    setTimeout(scrollWin(), 3000);
  }

  function errorAction(text) {
    var rec = document.getElementById("conversation");

    //rec.innerHTML += '<div class="alert alert-success" ><h2 class="animated  zoomIn">' + text + '</h2></div></div>';
  }

  function recognized(text) {
    var rec = document.getElementById("conversation");

    //rec.innerHTML += '<div class="recognized"><div>' + text + '</div></div>';
  }

  //Annyang service
  if (annyang) {
    // Let's define our first command. First the text we expect, and then the function it should call
    var commands = {
      paws: function() {
        socket.emit("pause");
        var msg = new SpeechSynthesisUtterance("Pausing");
        window.speechSynthesis.speak(msg);
      },
      "pause track": function() {
        socket.emit("pause");
        var msg = new SpeechSynthesisUtterance("Pausing");
        window.speechSynthesis.speak(msg);
      },
      Oz: function() {
        socket.emit("pause");
        var msg = new SpeechSynthesisUtterance("Pausing");
        window.speechSynthesis.speak(msg);
      },
      cars: function() {
        socket.emit("pause");
        var msg = new SpeechSynthesisUtterance("Pausing");
        window.speechSynthesis.speak(msg);
      },
      "good morning": function() {
        var msg = new SpeechSynthesisUtterance("Morning to you Master");
        window.speechSynthesis.speak(msg);
        annyang.stop();
        annyang.start();
      },
      "Spotify resume": function() {
        var msg = new SpeechSynthesisUtterance("Resuming");
        window.speechSynthesis.speak(msg);
        socket.emit("play");
      },
      "copy me *things": function(things) {
        var msg = new SpeechSynthesisUtterance(things);
        window.speechSynthesis.speak(msg);
        console.log("hello");
      },
      "play track *song": function(song) {
        recognized("Play track " + song);
        playSong(song);
      },
      "play *song by *artist": function(song, artist) {
        recognized("Play song " + song + " by " + artist);
        playSong(song, artist);
      },
      "play song *song": function(song) {
        recognized("Play song " + song);
        playSong(song);
      },
      "play *song": function(song) {
        recognized("Play " + song);
        playSong(song);
      },
      ":nomatch": function(message) {
        //recognized(message);
        console.log("match");
      }
    };

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start({ autoRestart: true, continuous: true });
  }

  annyang.addCallback("error", function() {
    errorAction("error");
  });
})();
