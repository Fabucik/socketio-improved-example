var socket = io();
      
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var button = document.getElementById("button")
var usertype = document.getElementById("usertype");

var formNick = document.getElementById('formNick');
var inputNick = document.getElementById('inputNick');

var nick;

formNick.addEventListener("submit", (e) => {
    e.preventDefault();
     if (inputNick.value) {
        nick = inputNick.value;

        input.disabled = false;
        button.disabled = false;

        formNick.parentNode.removeChild(formNick);

        socket.emit("usercon", nick);
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', nick, input.value);
        input.value = '';
        usertype.innerText = "";
    }
});

var typingTimeout = null;
    input.onkeydown = function(){
    socket.emit("typing", true, nick);
    console.log(typingTimeout);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(userStoppedTyping, 5000);
};

function userStoppedTyping(){
    socket.emit("typing", false);
};

socket.on("typing", (istyping, nickname) => {
    if (istyping) {
        usertype.innerText = nickname + " is typing";
    } else {
        usertype.innerText = "";
    }
});

socket.on('chat message', (nickname, msg) => {
    var item = document.createElement('li');
    item.textContent = nickname + ": " + msg;
    messages.appendChild(item);
    socket.emit("typing", false);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on("usercon", (nickname) => {
    var item = document.createElement("li");
    item.textContent = nickname + " connected!";
    item.style.fontWeight = "bold";
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})