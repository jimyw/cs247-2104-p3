// Given a new message string and an array of videos, detects each emoticon position
// in the string, replaces them with the videos and shows them to the user one word/video at a time
function receiveOne(msg, video, times){
  // Get array of emoticons.
  var emoticons = getEmoticons(msg);
  // Display message and video. 
  var msgDiv = document.createElement("div");
  msgDiv.innerHTML = msg;
  document.getElementById("receive_one_display").appendChild(msgDiv);
  $("#receive_one_display").append(createDisplayDiv(video));
  // Add container div to hold emoticons
  var emoticonDiv = document.createElement("div");
  emoticonDiv.id = "emoticon_div";
  document.getElementById("receive_one_display").appendChild(emoticonDiv);
  // Settimeouts to display emoticons and time intervals from array.
  times.forEach(function(time, index){
    setTimeout(function(){
      $("#emoticon_div").html(emoticons[index]);
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
  div.id = "video_div";
  div.appendChild(video);
  return div;
}
