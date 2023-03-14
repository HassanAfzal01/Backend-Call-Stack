const socket = io("/");

$.noConflict(); //need to load two versions of jQuery, we'll need to use jQuery.noConflict() to resolve which version you use when

function calling(toId,myid,myname,myimage){
     socket.emit("calling",{
         toId,
         myid,
         myname,
         myimage
     })
}

function accept(){
     let id = document.getElementById("inCommingId").innerText;
     let my_id = "<%= myData.id%>"
     socket.emit("accept",{
         id,
         my_id
     })
}

//incomming call
socket.on("incommingCall_"+"<%= myData.id%>",(data)=>{
     document.getElementById("IncommingCallAlert").classList.remove("overlayNone");
     document.getElementById("IncommingCallAlert").classList.add("overlay");
     document.getElementById("inCommingId").innerText = data.id;
     document.getElementById("inCommingName").innerText = data.name;
     document.getElementById("inCommingImage").src = data.image;
});

//incomming call
socket.on("connect"+"<%= myData.id%>",(data)=>{
     window.location.href = data.conn;
});
 

