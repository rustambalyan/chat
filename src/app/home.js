import {initializeApp, onLog} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
    child,
    set,
    get,
    update,
    push,
    getDatabase,
    ref,
    onChildAdded
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAcjkoMZcttxOBHOFqITeg0ajyFJhCx9OY",
    authDomain: "chatapp-5d0f0.firebaseapp.com",
    projectId: "chatapp-5d0f0",
    storageBucket: "chatapp-5d0f0.appspot.com",
    messagingSenderId: "361463095812",
    appId: "1:361463095812:web:d78f96e5fc72195f828b51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const dbRt = getDatabase();
const dbRef = ref(dbRt);

const uid = JSON.parse(sessionStorage.getItem('user-creds'));
const signOutButton = document.getElementById('signOutButton');
const loadingDiv = document.getElementById('loadingDivParent');
/////////////////////////////////////////////////////////////////////
let signOut = evt => {
    sessionStorage.removeItem('user-creds');
    sessionStorage.removeItem('user-info');
    window.location.replace('index.html')
    evt.preventDefault();
}
let checkCred = () => {
    if (!sessionStorage.getItem('user-creds')) {
        window.location.href = 'index.html'
    }
}

window.addEventListener('load', () => checkCred())
signOutButton.addEventListener('click', signOut);

/////////////////////////////////////////////////////////////////////

// let selectedUser = document.querySelectorAll('.selectUser');
// selectedUser.forEach((user) => {
//     const userName = user.innerText;
//     user.addEventListener('click', openChat);
// })
let sendButton = document.getElementById('sendButton');
let messageInput = document.getElementById('messageInput');

let form = document.getElementById('form');

function createSendingMessage(data) {
    return `
                    <div id="sentMessage" style="display: flex; align-items: flex-end; width: auto; min-height: 60px">
                    <div style="min-width: 260px; height: 100%; background-color: #4165f3; border-radius: 20px">
                        <span>
                                <div style="padding: 3px; margin: 11px; max-width: 260px; color: white; word-wrap: break-word">${data}</div>
                        </span>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center; width: 60px; height: 100%">
                        <div style="width: 45px; height: 45px; background-image: url(images/userImages/userImageMan.jpg); background-size: 100%; border: 0 solid; border-radius: 50px">
                        </div>
                    </div>
                </div>
`
}

function createReceivedMessage(messages) {
    return `
                    <div id="receivedMessage" class="receivedMessage">
                        <div style="display: flex; justify-content: center; align-items: center; width: 60px; height: 100%">
                            <div style="width: 45px; height: 45px; background-image: url(images/userImages/userImageWoman.jpg); background-size: 100%; border: 0 solid; border-radius: 50px">
                            </div>
                        </div>
                        <div style="min-width: 260px; height: 100%; background-color: #e5e6ea; border-radius: 20px">
                        <span>
                            <div style="padding: 3px; margin: 11px; max-width: 260px; color: black">${messages}</div>
                        </span>
                        </div>
                    </div>
`
}

form.addEventListener('submit', (e) => {
    if (messageInput.value.replace(/\s+/g, '') !== '') {
    } else {
        messageInput.value = '';
    }
    e.preventDefault()
});
function scrollBottom() {
    let elem = document.getElementById('messagesArea');
    elem.scrollTop = elem.scrollHeight;
}
async function jsParse() {
    return await JSON.parse(sessionStorage.getItem('user-creds'));
}
function setUser() {
    set(ref(dbRt, 'usersList/'), {
        users: [{
            firstName: 'Vaxo',
            lastName: 'Xachatryan',
            uID: 'ThisIsUserUID',
            messages: [
                'hello russo', 'es lav em'
            ]
        }]
    })
}
function addToFriendList() {

}

function sendMessage(message) {
    jsParse().then(val => val.uid).then((uid) => {
        push(ref(dbRt, 'usersList/' + uid + '/messages/'), {text: message, timeStamp: Date.now()});
    })

}

function displayMessage(message) {
    const messagesArea = document.getElementById('messagesArea');
    const sendingMessage = document.createElement('div');
    sendingMessage.innerHTML = createSendingMessage(message);
    messagesArea.appendChild(sendingMessage);
    loadingDiv.remove()
}

form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    jsParse().then(() => {
        let message = messageInput.value;
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            sendMessage(message);
            messageInput.value = ''
        }
    });

})

window.addEventListener("load", () => {
    const messagesArea = document.getElementById('messagesArea');
    const noMessages = document.createElement('div');
    console.log(messagesArea.childNodes.length)
    if (messagesArea.childNodes.length === 1) {
        console.log('this')
        noMessages.id = 'noMessages'
        noMessages.innerHTML = `
           <div style="width: 320px; height: 200px; display: flex; justify-content: center; align-items: center ">
                <span>There are no messages</span>
            </div>
        `
        messagesArea.appendChild(noMessages);
        setTimeout(() => loadingDiv.remove(), 1500)

    } else {
        noMessages.remove();
        onChildAdded(ref(dbRt, 'usersList/' + uid.uid + '/messages/'), (snap) => {
            console.log(snap)
            if (snap.exists) {
                displayMessage(snap.val().text);
                scrollBottom()
            }
            loadingDiv.remove();
        })
        setTimeout(() => loadingDiv.remove(), 1500)
    }
    onChildAdded(ref(dbRt, 'usersList/' + uid.uid + '/messages/'), (snap) => {
        console.log(snap)
        if (snap.exists) {
            displayMessage(snap.val().text);
            scrollBottom()
        }
        noMessages.remove();
    })

})