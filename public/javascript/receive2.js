var WORD_TIME_INTERVAL = 2000;
var VIDEO_TIME_INTERVAL = 5000;


// Given a new message string and an array of videos, detects each emoticon position
// in the string, replaces them with the videos and shows them to the user one word/video at a time
function receiveTwo(msg, videos){
  var splitMsg = msg.match(/\S+/g);
  var totalTime = 0;
  var currentVideoIndex = 0;
  splitMsg.forEach(function(token, index){
    if(isEmoticon(token)){
      var thisVideoIndex = currentVideoIndex;
      setTimeout(function(){
        displayVideo(videos[thisVideoIndex]);
      }, totalTime);
      totalTime += VIDEO_TIME_INTERVAL;
    } else {
      setTimeout(function(){
        displayWord(token);
      }, totalTime);
      totalTime += WORD_TIME_INTERVAL;
      
    };
  });
}


function displayWord(token){
  $("#receive_one_display").html(token);
}

String.prototype.startsWith = function (str){
  return this.indexOf(str) == 0;
};


function isEmoticon(token){
  return token === ":-)" || token === ":-(" || token === "lol";
}

// Function takes a vidxeo blob, converts it, and displays it.
function displayVideo(videoBlob){
  var video = document.createElement("video");
  video.autoplay = true;
  video.controls = false; // optional
  video.loop = true;
  video.width = 120;
  var source = document.createElement("source");
  source.src =  URL.createObjectURL(base64_to_blob(videoBlob));
  source.type =  "video/webm";

  video.appendChild(source);
  document.getElementById("receive_one_display").innerHTML = "";
  document.getElementById("receive_one_display").appendChild(video);
}