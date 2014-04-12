// Given a new message string and an array of videos, detects each emoticon position
// in the string, replaces them with the videos and shows them to the user one word/video at a time
function receiveOne(msg, videos){
  console.log('videos');
  console.log(videos);
  var splitMsg = msg.match(/\S+/g);
  var currentVideoIndex = 0;
  var newMsgHtml = "<div>";
  var videosDiv = document.createElement("div");
  splitMsg.forEach(function(token, index){
    if(isEmoticon(token)){
      var thisVideoIndex = currentVideoIndex;
      newMsgHtml += "<span style='color:green;font-weight:bold'>" + token + "</span>";
      var newVideoDiv = createVideoDiv(videos[thisVideoIndex]);
      videosDiv.appendChild(newVideoDiv);
    } else {
      newMsgHtml += token + " ";
    };
  });
  newMsgHtml += "</div>";
  $("#receive_two_display").html(newMsgHtml);
  document.getElementById("receive_two_display").appendChild(videosDiv);
}


function isEmoticon(token){
  return token === ":-)" || token === ":-(" || token === "lol";
}

function createVideoDiv(videoBlob){
  var video = document.createElement("video");
  video.autoplay = true;
  video.controls = false; // optional
  video.loop = true;
  video.width = 120;
  var source = document.createElement("source");
  source.src =  URL.createObjectURL(base64_to_blob(videoBlob));
  source.type =  "video/webm";

  video.appendChild(source);
  var div = document.createElement("div");
  div.appendChild(video);
  return div;
}
