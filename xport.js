var Rdio = require("./rdio");
var rdio = new Rdio(["your-rdio-api-key", "your-rdio-api-secret"]);
var readline = require("readline");
var fs = require("fs");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("what username do you want to export all tracks for? ", function(vanityName) {
  rdio.call("findUser", {vanityName:vanityName}, function(err, data) {
    if(!err) {
      if(data.status == "ok") {
        var user_key = data.result.key;
  
        rdio.call("getTracksInCollection", {user:user_key}, function(err, data) {
          if(!err) {
            if(data.status == "ok") {
              var fd = fs.openSync("rdio-track-export." + vanityName + ".csv", "w");
              fs.writeSync(fd, "Artist,Album,Track");
              for(var i = 0; i < data.result.length; i++) {
                var track = data.result[i];
                fs.writeSync(fd, 
                  "\"" + track.artist.replace(/"/g, '""')  + 
                  "\",\"" + track.album.replace(/"/g, '""') + 
                  "\",\"" + track.name.replace(/"/g, '""') + "\"\n");
              }
              rl.close();
            } else {
              console.error("no tracks found!?");
              rl.close();
            }
          }
        });
      } else {
        console.error(vanityName + " not found or is not public");
        rl.close();
      }
    }
  });
});
