const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const send_button = document.getElementById('sendmessage');
let prevMessages = [];
//get username and room from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});
 
 if(username){
     send_button.disabled = false; 
 }
 if(!username){
     location.replace("http://localhost:3000/login.html")
 }
let c = document.cookie;
console.log(c)
const socket = io.connect();
//join chatroom
socket.emit('joinRoom', {username, room});

//get room and users
socket.on('roomUsers', ({room, users}) =>{
    outputRoomName(room);
})

socket.on('prevMessages', messages=>{
    prevMessages = messages;
    outputOldMessages(prevMessages)
})

//message from server
socket.on('message', message =>{
    outputMessage(message);
    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

//message submit
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //getting text
    let msg = e.target.elements.msg.value;
    msg = msg.trim();
    if(!msg){
        return false;
    }
    //emit to server
    socket.emit('chatMessage',msg);


    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

//output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to dom
function outputRoomName(room){
    roomName.innerText = room;
}



function outputOldMessages(messages){
    messages.map((message)=>{
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${message.from_user} <span>${message.date_sent}</span></p>
        <p class="text">
       ${message.message}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
    })

   
  
}
