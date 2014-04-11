// Given a new message string and an array of videos, detects each emoticon position
// in the string, replaces them with the videos and shows them to the user one word/video at a time
function receiveTwo(msg, videos){
  var splitResults = splitByEmoticon(msg);
  var splitMsg = splitResults["splitMsg"];
  var matchedEmoticons = splitResults["matchedEmoticons"];
  console.log(splitMsg);
  console.log(matchedEmoticons);
  var newMsgDiv = createNewMsgDiv(splitMsg, matchedEmoticons, msg);
  document.getElementById("conversation").appendChild(newMsgDiv);
}

String.prototype.startsWith = function (str){
  return this.indexOf(str) == 0;
};

function createNewMsgDiv(splitMsg, matchedEmoticons, originalMsg){
  var newMsgDivHtml = "";
  var currentEmoticonIndex = 0;
  for(var msgSubpart in splitMsg){
    if(startsWithEmoticon(originalMsg)){
      newMsgDivHtml = "<div>" + msgSubpart + "</div>";
      newMsgDivHtml += matchedEmoticons[currentEmoticonIndex];
      currentEmoticonIndex += 1;
    } else {
      newMsgDivHtml = matchedEmoticons[currentEmoticonIndex];
      currentEmoticonIndex += 1;
      newMsgDivHtml += "<div>" + msgSubpart + "</div>";
    }
  }
  var newMsgDiv = document.createElement("div");
  newMsgDiv.innerHTML = newMsgDivHtml;
  return newMsgDiv;
}

// returns true if msg starts with emoticon
function startsWithEmoticon(msg){
  return msg.startsWith(":)") || msg.startsWith(":(") || msg.startsWith("lol");
}

// Function that takes a string, and delimits it by emoticons and returns both delimited strings
// as array and array of positions of where emoticons where
function splitByEmoticon(msg, videos){
  // emoticonList is global variable defined in main1.js
  // Need to convert emoticon list into regex automatically?
  var splitMsg = msg.split(/:\)|:\(|lol/);
  var matchedEmoticons = msg.match(/:\)|:\(|lol/);
  return {"splitMsg" : splitMsg, "matchedEmoticons" : matchedEmoticons};
}

