// Given a new message string and an array of videos, detects each emoticon position
// in the string, replaces them with the videos and shows them to the user one word/video at a time
function receiveOne(msg, video, times){
  console.log(times);
  // Get array of emoticons.
  var emoticons = getEmoticons(msg);
  // Display message and video. 
  var msgDiv = document.createElement("div");
  msgDiv.innerHTML = msg;
  document.getElementById("receive_one_display").appendChild(msgDiv);
  if(video == null){
    return;
  }
  var videoDiv = createVideoDiv(video);
  $("#receive_one_display").append(videoDiv);
  // Add container div to hold emoticons
  var emoticonDiv = document.createElement("div");
  emoticonDiv.style.position = "absolute";
  emoticonDiv.style.left = "4px";
  emoticonDiv.style.bottom = "4px";
  emoticonDiv.style.backgroundColor = "white";
  videoDiv.appendChild(emoticonDiv);
  // Settimeouts to display emoticons and time intervals from array.
  
  times.forEach(function(time, index){
    var x = index;
    setTimeout(function(){
      console.log(x);
      emoticonDiv.innerHTML = emoticons[x];
    }, time);
  });
}

function getEmoticons(msg){
  return msg.match(/:-\)|:-\(|lol/g);
}

function createVideoDiv(videoBlob, videoIndex){
  var video = document.createElement("video");
  video.id = "video" + videoIndex;
  video.autoplay = true;
  video.controls = false; // optional
  video.loop = true;
  video.width = 120;
  var source = document.createElement("source");
  source.src =  URL.createObjectURL(base64_to_blob(videoBlob));
  source.type =  "video/webm";

  video.appendChild(source);
  var div = document.createElement("div");
  div.style.position = "relative";
  div.appendChild(video);
  return div;
}
