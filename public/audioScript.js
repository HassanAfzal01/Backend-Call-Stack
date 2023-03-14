const socket = io("/");
const videoGrid = document.getElementById("callAlert");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
myVideo.muted = true;

backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});

const user = NAME;

var peer = new Peer();
var peerId;
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    video:true,
    audio:true,
    audio: {
      autoGainControl: false,
      channelCount: 2,
      echoCancellation: false,
      latency: 0,
      noiseSuppression: false,
      VoiceActivityDetection:false,
      sampleRate: 48000,
      sampleSize: 16,
      volume: 0.9
    }
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    setTimeout(()=>{
      socket.emit("ready")
    },1000)
 
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      }); 
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close' , ()=>{
    video.remove();
  })
  peerId = call;
};

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, user);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    // videoGrid.append(video);
  });
};

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let endButton = document.getElementById("callEnd");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

endButton.addEventListener("click", () => {
  socket.emit("callClosed",{
    conncId:ROOM_ID
  })
});

// const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");

muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});


// inviteButton.addEventListener("click", (e) => {
//   prompt(
//     "Copy this link and send it to people you want to meet with",
//     window.location.href
//   );
// });

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
});



socket.on("callClosed"+ROOM_ID,()=>{
  if(peerId){
    peerId.close();
    window.history.back();
  }
  else{
    window.history.back();
  }
})

socket.emit("onCall",{
  id : MY_ID
})