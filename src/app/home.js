import {initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {Database} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

/////////////////////////////////////////////////////////////////////
const signOutButton = document.getElementById('signOutButton');
let signOut = evt => {
    console.log('this')
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

window.addEventListener('load', checkCred);
signOutButton.addEventListener('click', signOut);
let loadingDiv = document.getElementById('loadingDivParent');
setTimeout(() => loadingDiv.remove(), 1000);

/////////////////////////////////////////////////////////////////////

document.getElementById('sendButton');
let messageInput = document.getElementById('messageInput');
let messArr = [];

let form = document.getElementById('form');

function createMessageElement(data) {
    return `
<br>
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

form.addEventListener('submit', (e) => {
    if (messageInput.value.replace(/\s+/g, '') !== '') {
        messArr.unshift(messageInput.value);
        sendMessageToServer();
        getLastMessage();
        messageInput.value = '';
    } else {
        messageInput.value = '';
    }
    e.preventDefault()
});

function scrollBottom() {
    let elem = document.getElementById('messagesArea');
    elem.scrollTop = elem.scrollHeight;
}

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

function sendMessageToServer() {
    const str = Date.now().toString()
    try {
        const writeMessage = setDoc(doc(db, "messages", str), {
            message: messArr[0],
            timeStamp: str
        });
        writeMessage.then((result) => {
        })
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

document.addEventListener('DOMContentLoaded', () => getAllMessagesFromServer());

function getAllMessagesFromServer() {
    getDocs(collection(db, 'messages')).then((message) => {
        message.forEach((doc) => {
            const messagesArea = document.getElementById('messagesArea');
            const message = document.createElement('div');
            message.innerHTML = createMessageElement(doc._document.data.value.mapValue.fields.message.stringValue);
            messagesArea.appendChild(message);
            scrollBottom()
        })
    })
}

function getLastMessage() {
    getDocs(collection(db, 'messages')).then((mess) => {
        const lastMessage = mess.docs.slice(-1);
        const messagesArea = document.getElementById('messagesArea');
        const message = document.createElement('div');
        message.innerHTML = createMessageElement(lastMessage[0]._document.data.value.mapValue.fields.message.stringValue);
        messagesArea.appendChild(message);
        scrollBottom()
    })

}