const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
let prevMessages = [];

//get username and room from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});

const socket = io.connect();

//join chatroom
socket.emit('joinRoom', {username, room});

//get room and users
socket.on('roomUsers', ({room, users}) =>{
    outputRoomName(room);
    outputUsers(users);
})

socket.on('prevMessages', messages=>{
    prevMessages = messages;
    outputOldMessages(prevMessages)
    console.log(prevMessages)
})

//message from server
socket.on('message', message =>{
    console.log(message);
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

//Addign users to dom
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user =>`<li>${user.username}</li>`).join('')}
    `
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
