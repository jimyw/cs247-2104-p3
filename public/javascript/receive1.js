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
      newMsgHtml += "<span class='emoticons' data='video" + thisVideoIndex + "' style='color:green;font-weight:bold'>" + token + "</span>";
      var newVideoDiv = createVideoDiv(videos[thisVideoIndex], thisVideoIndex);
      videosDiv.appendChild(newVideoDiv);
      currentVideoIndex += 1;
    } else {
      newMsgHtml += token + " ";
    };
  });
  newMsgHtml += "</div>";
  $("#receive_two_display").html(newMsgHtml);
  document.getElementById("receive_two_display").appendChild(videosDiv);
}

function initialize_receive_one(){
  $('body').on('mouseenter','.emoticons',function(){
    var videoId = $(this).attr("data");
    var video = document.getElementById(videoId);
    video.play();
  });
}

function isEmoticon(token){
  return token === ":-)" || token === ":-(" || token === "lol";
}

function createVideoDiv(videoBlob, videoIndex){
  var video = document.createElement("video");
  video.id = "video" + videoIndex;
  video.autoplay = false;
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
