// Given a new message string and an array of videos, detects each emoticon position
// in the string, replaces them with the videos and shows them to the user one word/video at a time
function receiveOne(msg, videos){
  console.log('receiveOne')
  console.log(msg)
  var splitMsg = splitByEmoticon(msg);
  var currentVideoIndex = 0;
  splitMsg.forEach(function(msgSubpart){
    // Based on if it starts with emoticon, we start with video vs msg substring
    if(startsWithEmoticon(msg)){
      displayVideo(videos[currentVideoIndex]);
      currentVideoIndex += 1;
      displayMsgSubpart(msgSubpart);
    } else {
      displayMsgSubpart(msgSubpart);
      displayVideo(videos[currentVideoIndex]);
      currentVideoIndex += 1;
    }
  });
}

String.prototype.startsWith = function (str){
  return this.indexOf(str) == 0;
};


// returns true if msg starts with emoticon
function startsWithEmoticon(msg){
  console.log('startsWithEmoticon')
  console.log(msg)
  return msg.startsWith(":-)") || msg.startsWith(":-(") || msg.startsWith("lol");
}

// Function that takes a string, and delimits it by emoticons and returns both delimited strings
// as array and array of positions of where emoticons where
function splitByEmoticon(msg, videos){
  // emoticonList is global variable defined in main1.js
  // Need to convert emoticon list into regex automatically?
  var splitMsg = msg.split(/:\)|:\(|lol/);
  return splitMsg;
}

// Function takes a message subpart, and for each word in it, displays it for half a second, before returning
function displayMsgSubpart(msgSubpart){
  var words = msgSubpart.split(" ");
  var currentWordIndex = 0;
  
  var timerId;
  function displayNextWord(){
    console.log("In display next word");
    if(currentWordIndex != words.length){
      $("#receive_one_display").html(words[currentWordIndex]);
      currentWordIndex += 1;
    } else{
      clearInterval(timerId);
    }
  };
  timerId = setInterval(displayNextWord, 500);
}

// Function takes a video blob, converts it, and displays it.
function displayVideo(video){
  var video = document.createElement("video");
  video.autoplay = true;
  video.controls = false; // optional
  video.loop = true;
  video.width = 120;
  var source = document.createElement("source");
  source.src =  URL.createObjectURL(base64_to_blob(video));
  source.type =  "video/webm";

  video.appendChild(source);
  document.getElementById("receive_one_display").innerHTML = "";
  document.getElementById("receive_one_display").appendChild(video);
}