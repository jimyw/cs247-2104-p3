// Initial code by Borui Wang, updated by Graham Roth
// For CS247, Spring 2014

function base64_to_blob(base64) {
  var binary = atob(base64);
  var len = binary.length;
  var buffer = new ArrayBuffer(len);
  var view = new Uint8Array(buffer);
  for (var i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
  }
  var blob = new Blob([view]);
  return blob;
  };

(function() {

  var cur_video_blob = null;
  var videoBlobArray = new Array();
  var fb_instance;
  var options = ["lol",":-)",":-("];
  var startWriting = false;  // checks if user is typing something
  var writingTimeStamp;
  var emoticonTimeArray = new Array();  // time in miliseconds for when emoticon was detected
  var msg = null;

  $(document).ready(function(){
    connect_to_chat_firebase();
    connect_webcam();
  });

  function connect_to_chat_firebase(){
    /* Include your Firebase link here!*/
    fb_instance = new Firebase("https://hjcs247p3.firebaseio.com");

    // generate new chatroom id or use existing id
    var url_segments = document.location.href.split("/#");
    if(url_segments[1]){
      fb_chat_room_id = url_segments[1];
    }else{
      fb_chat_room_id = Math.random().toString(36).substring(7);
    }
    console.log("fb chat room id");
    console.log(fb_chat_room_id);
    display_msg({m:"Share this url with your friend to join this chat: "+ document.location.origin+"/#"+fb_chat_room_id,c:"red"})
    console.log('starting')
    // set up variables to access firebase data structure
    var fb_new_chat_room = fb_instance.child('chatrooms').child(fb_chat_room_id);
    var fb_instance_users = fb_new_chat_room.child('users');
    fb_instance_stream = fb_new_chat_room.child('stream');
    my_color = "#"+((1<<24)*Math.random()|0).toString(16);

    // listen to events
    fb_instance_users.on("child_added",function(snapshot){
      display_msg({m:snapshot.val().name+" joined the room",c: snapshot.val().c});
    });
    fb_instance_stream.on("child_added",function(snapshot){
      //display_msg(snapshot.val());
      console.log("snapsnot . v");
      //console.log(snapshot.val().v);
      receiveOne(snapshot.val().m, snapshot.val().v, snapshot.val().t, snapshot.val().c);
    });

    // block until username is answered
    username = window.prompt("Welcome, warrior! please declare your name?");
    if(!username){
      username = "anonymous"+Math.floor(Math.random()*1111);
    }
    fb_instance_users.push({ name: username,c: my_color});
    $("#waiting").remove();

    // bind submission box
    $("#submission input").keyup(function( event ) {
      console.log("firing keyup");
      
      var currString = $("#textbox").val();
      if (!startWriting) {    // has not started typing yet
        console.log('started typing now')
        mediaRecorder.start(10000000); 
        startWriting = true;
        writingTimeStamp = new Date();
      } else if (event.which == 13) {   // ENTER key was typed
        console.log('ENTER key was typed')
        startWriting = false;
        mediaRecorder.stop();
      } else if (msg !== $("#textbox").val() && has_emotions(currString.slice(-3))) {  // checks emoticon
        console.log("emoticon detected");
        emoticonTimeArray.push(new Date()-writingTimeStamp);  // time in ms
      }
      msg = $("#textbox").val();
      if (event.which == 13) {

        

        msg = $(this).val();
        
        $(this).val("");
        scroll_to_bottom(0);
      }
    });

    // scroll to bottom in case there is already content
    scroll_to_bottom(1300);
  }

  // creates a message node and appends it to the conversation
  function display_msg(data){
    $("#conversation").append("<div class='msg' style='color:"+data.c+"'>"+data.m+"</div>");
    if(data.v){
      // for video element
      var video = document.createElement("video");
      video.autoplay = true;
      video.controls = false; // optional
      video.loop = true;
      video.width = 120;

      var source = document.createElement("source");
      source.src =  URL.createObjectURL(base64_to_blob(data.v));
      source.type =  "video/webm";

      video.appendChild(source);

      // for gif instead, use this code below and change mediaRecorder.mimeType in onMediaSuccess below
      // var video = document.createElement("img");
      // video.src = URL.createObjectURL(base64_to_blob(data.v));

      document.getElementById("conversation").appendChild(video);
    }
  }

  function scroll_to_bottom(wait_time){
    // scroll to bottom of div
    setTimeout(function(){
      $("html, body").animate({ scrollTop: $(document).height() }, 200);
    },wait_time);
  }

  function connect_webcam(){
    // we're only recording video, not audio
    var mediaConstraints = {
      video: true,
      audio: false
    };

    // callback for when we get video stream from user.
    var onMediaSuccess = function(stream) {
      // create video element, attach webcam stream to video element
      var video_width= 160;
      var video_height= 120;
      var webcam_stream = document.getElementById('webcam_stream');
      var video = document.createElement('video');
      webcam_stream.innerHTML = "";
      // adds these properties to the video
      video = mergeProps(video, {
          controls: false,
          width: video_width,
          height: video_height,
          src: URL.createObjectURL(stream)
      });
      video.play();
      webcam_stream.appendChild(video);

      // counter
      var time = 0;
      var second_counter = document.getElementById('second_counter');
      var second_counter_update = setInterval(function(){
        second_counter.innerHTML = time++;
      },1000);

      // now start recording stream as soon as text box is non empty
      var video_container = document.getElementById('video_container');
      mediaRecorder = new MediaStreamRecorder(stream);
      var index = 1;

      mediaRecorder.mimeType = 'video/webm';
      // mediaRecorder.mimeType = 'image/gif';
      // make recorded media smaller to save some traffic (80 * 60 pixels, 3*24 frames)
      mediaRecorder.video_width = video_width/2;
      mediaRecorder.video_height = video_height/2;

      mediaRecorder.ondataavailable = function (blob) {
          video_container.innerHTML = "";
          
          // convert data into base 64 blocks
          blob_to_base64(blob,function(b64_data){
            cur_video_blob = b64_data;
            videoBlobArray.push(cur_video_blob);
            function onComplete(error) {
              if (!error) {
                videoBlobArray = new Array();
              }
            }
            if(has_emotions(msg)){
            //  console.log("HAS EMOTICONS");
              //console.log(videoBlobArray);
              
              //console.log(emoticonTimeArray);
              fb_instance_stream.push({m:username+": " +msg, v: cur_video_blob, c: my_color, t: emoticonTimeArray}, onComplete);
            }else{
              //console.log("DOES NOT HAVE EMOTICONS");
              fb_instance_stream.push({m:username+": " +msg, c: my_color}, onComplete);
            }
            emoticonTimeArray = new Array();  // time in miliseconds for when emoticon was detected
          });
          //console.log('cur video blob in dataavaiable');
          //console.log(cur_video_blob)
      };

/*
      $("#textbox").keyup(function( event ) {
        var currString = $("#textbox").val();
        if (!startWriting) {    // has not started typing yet
          console.log('started typing now')
          mediaRecorder.start(10000000); 
          startWriting = true;
          writingTimeStamp = new Date();
        } else if (event.which == 13) {   // ENTER key was typed
          console.log('ENTER key was typed')
          startWriting = false;
          mediaRecorder.stop();
        } else if (has_emotions(currString.slice(-3))) {  // checks emoticon
          console.log("emoticon detected");
          emoticonTimeArray.push(new Date()-writingTimeStamp);  // time in ms
        }
      });
*/
      console.log("connect to media stream!");
    }

    // callback if there is an error when we try and get the video stream
    var onMediaError = function(e) {
      console.error('media error', e);
    }

    // get video stream from user. see https://github.com/streamproc/MediaStreamRecorder
    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
  }

  // check to see if a message qualifies to be replaced with video.
  var has_emotions = function(msg){
    for(var i=0;i<options.length;i++){
      if(msg.indexOf(options[i])!= -1){
        return true;
      }
    }
    return false;
  }


  // some handy methods for converting blob to base 64 and vice versa
  // for performance bench mark, please refer to http://jsperf.com/blob-base64-conversion/5
  // note useing String.fromCharCode.apply can cause callstack error
  var blob_to_base64 = function(blob, callback) {
    var reader = new FileReader();
    reader.onload = function() {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      callback(base64);
    };
    reader.readAsDataURL(blob);
  };


})();
