var WORD_TIME_INTERVAL = 1000;
var VIDEO_TIME_INTERVAL = TIME_DELAY;
var version = "B"; // Can be 'B'
var VIDEO_HEIGHT = 80;

// Given a new message string and an array of videos, detects each emoticon position
// in the string, replaces them with the videos and shows them to the user two word/video at a time
function receiveTwo(msg, videos, color){
  console.log("videos");
  console.log(videos);
  var outerDiv = document.createElement("div");
  outerDiv.style.color = color;
  var splitMsg = msg.match(/\S+/g);
  var totalTime = 0;
  var currentVideoIndex = 0;
  splitMsg.forEach(function(token, index){
    if(isEmoticon(token)){
      var thisVideoIndex = currentVideoIndex;
      setTimeout(function(){
        displayVideo(videos[thisVideoIndex], outerDiv);
      }, totalTime);
      totalTime += VIDEO_TIME_INTERVAL;
      currentVideoIndex += 1;
    } else {
      setTimeout(function(){
        displayWord(token, outerDiv);
      }, totalTime);
      totalTime += WORD_TIME_INTERVAL;
      
    };
  });
  document.getElementById("receive_two_display").appendChild(outerDiv);
}


function displayWord(token, outerDiv){
  // $("#receive_two_display").
  if(version === "A"){
    outerDiv.innerHTML = token;
  } else {
    outerDiv.innerHTML = outerDiv.innerHTML + " " + token;
  }
}

String.prototype.startsWith = function (str){
  return this.indexOf(str) == 0;
};


function isEmoticon(token){
  return token === ":-)" || token === ":-(" || token === "lol";
}

// Function takes a vidxeo blob, converts it, and displays it.
function displayVideo(videoBlob, outerDiv){
  var video = document.createElement("video");
  video.setAttribute("class", "videoClasses")
  video.autoplay = true;
  video.controls = false; // optional
  video.loop = true;
  video.height = VIDEO_HEIGHT;
  var source = document.createElement("source");
  source.src =  URL.createObjectURL(base64_to_blob(videoBlob));
  source.type =  "video/webm";

  video.appendChild(source);
  if(version === "A"){
    outerDiv.innerHTML = "";
  }else{

  }
  outerDiv.appendChild(video);
}