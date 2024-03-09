import {initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getFirestore,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
    set,
    get,
    ref,
    getDatabase,
    onChildAdded
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import {
    getStorage,
    uploadBytes,
    ref as sRef,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAcjkoMZcttxOBHOFqITeg0ajyFJhCx9OY",
    authDomain: "chatapp-5d0f0.firebaseapp.com",
    databaseURL: "https://chatapp-5d0f0-default-rtdb.firebaseio.com",
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
const auth = getAuth();
const storage = getStorage(app)


// const uId = JSON.parse(sessionStorage.getItem('user-creds'));
const signOutButton = document.getElementById('signOutButton');
const loadingDiv = document.getElementById('loadingDivParent');
const createChatButtonDiv = document.getElementById('createChatButtonDiv');
const addPhotoIcon = document.getElementById('addPhotoIcon');
const addPhotoInput = document.getElementById('addPhotoInput');
const userPhotoContainer = document.getElementById('userPhotoContainer');
const userFullNameDiv = document.getElementById('userFullNameDiv');
const selectUserParent = document.getElementById('selectUserParent');
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

// form.addEventListener('submit', (e) => {
//     if (messageInput.value.replace(/\s+/g, '') !== '') {
//     } else {
//         messageInput.value = '';
//     }
//     e.preventDefault()
// });
let messagesArea = document.getElementById('messagesArea');

function scrollBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

async function jsParseCreds() {
    return await JSON.parse(sessionStorage.getItem('user-creds'));
}

async function jsParseInfo() {
    return await JSON.parse(sessionStorage.getItem('user-info'));
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

let recipientId = '';

function sendMessage(message) {
    jsParseCreds().then(val => val.uid).then((uid) => {
        get(ref(dbRt, 'chatLists/' + uid + recipientId + '/messages/')).then((snap) => {
            if (!snap.exists) {
                set(ref(dbRt, 'chatLists/' + uid + recipientId + '/messages/' + Date.now()), {
                    text: message,
                    timeStamp: Date.now()
                });
            }
        })
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
    jsParseCreds().then(() => {
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
    if (messagesArea.childNodes.length === 1) {
        noMessages.id = 'noMessages'
        noMessages.innerHTML = `
           <div style="width: 320px; height: 200px; display: flex; justify-content: center; align-items: center ">
                <span>There are no messages</span>
            </div>
        `
        messagesArea.appendChild(noMessages);
        setTimeout(() => loadingDiv.remove(), 1500)

    } else {
        jsParseCreds().then((res) => {
            noMessages.remove();
            onChildAdded(ref(dbRt, 'chatsList/' + res.uid + recipientId + '/messages/'), (snap) => {
                if (snap.exists) {
                    displayMessage(snap.val().text);
                    scrollBottom()
                }
                loadingDiv.remove();
            })
            setTimeout(() => loadingDiv.remove(), 1500)
        })

    }
    jsParseCreds().then((res) => {
        onChildAdded(ref(dbRt, 'chatsList/' + res.uid + recipientId + '/messages/'), (snap) => {
            if (snap.exists) {
                console.log(snap.val())
                displayMessage(snap.val().text);
                scrollBottom()
            }
            noMessages.remove();
        })
    })

})

createChatButtonDiv?.addEventListener('click', sendMessage)
///////////////////////////////////////////////////////////////////////

// const fileInput = document.getElementById('fileInput');
// fileInput.addEventListener('change', getFile);
//
// function getFile() {
//     const f = fileInput.files[0];
//     upload(f)
//
// }
//
// function upload(file) {
//     // let s = getFileNameWithoutExtension(file);
//
//     // getStorage(app, ref(dbRt, 'userPhotos/' + s));
//     const storageRef = sRef(storage, 'userPhotos/' + file.name)
//
//
//     // const r = ref(storage, 'userPhotos'  + s);
//     setTimeout(() => {
//         uploadBytes(storageRef, file)
//     }, 3000)
// }
//
//
//
//
//
//
// function createChat() {
//     get(ref(dbRt, 'chatsList/' + uId + 'ididididididididididid' + '/messages')).then(chat => {
//         console.log(chat.exists())
//         if(chat.exists()){
//             set(ref(dbRt, 'chatsList/' + uId + 'ididididididididididid' + '/messages/' + Date.now()), {message: messageInput.value, timeStamp: Date.now()}).then(r => {
//                 console.log(r, 'this is r')
//             });
//         }
//     });
// }


// function getFileNameWithoutExtension(file) {
//     const fileName = file.name;
//     const lastDotIndex = fileName.lastIndexOf('.');
//     if (lastDotIndex === -1) {
//         return fileName; // Файл без расширения
//     } else {
//         return fileName.substring(0, lastDotIndex); // Имя файла без расширения
//     }
// }

function getFile() {
    addPhotoInput.addEventListener("change", async (res) => {
        const file = await res.srcElement.files[0];
        console.log(res);
        upload(file)
    });
}

function upload(file) {
    jsParseCreds().then((result) => {
        const storageRef = sRef(storage, 'userImages/' + result.uid + file.name);
        uploadBytes(storageRef, file).then(() => {
            getFileFromStorage(file)
        })
    })
}

function getFileFromStorage(file) {
    jsParseCreds().then((result) => {
        const storageRef = sRef(storage, 'userImages/' + result.uid + file.name);

        getDownloadURL(storageRef).then((res) => {
            set(ref(dbRt, 'usersList/' + result.uid + '/userPhoto'), {userPhotoURL: res});
            func(res)
        })
    })

}

function func() {
    jsParseCreds().then((result) => {
        get(ref(dbRt, 'usersList/' + result.uid + '/userPhoto')).then((r) => {
            if (r) {
                userPhotoContainer.style.background = `url(${r.val().userPhotoURL})`;
                userPhotoContainer.style.backgroundSize = '128px';
                addPhotoIcon.remove()
            } else {
                userPhotoContainer.style.background = `url("images/userImages/userImageMan.jpg")`
            }
        })
    })
}

window.onload = () => {
    jsParseCreds().then((res) => {
        console.log(res.uid)
        get(ref(dbRt, 'usersList/' + res.uid + '/userPhoto')).then((r) => {
            if (r.exists()) {
                userPhotoContainer.style.background = `url(${r.val().userPhotoURL})`;
                userPhotoContainer.style.backgroundSize = '128px';
                addPhotoIcon.remove()
            } else {
                userPhotoContainer.style.background = `url("images/userImages/userImageMan.jpg")`;
                userPhotoContainer.style.backgroundSize = '128px';

            }
        })
    })
    getUsersFromServer()
}

addPhotoIcon.addEventListener("click", addPhoto);

function addPhoto() {
    addPhotoInput.click();
    getFile()
}

const userFullNameSpan = document.createElement('span');

const json = JSON.parse(sessionStorage.getItem('user-info'));

userFullNameSpan.innerText = json.firstName + ' ' + json.lastName;
userFullNameSpan.style.textOverflow = 'ellipsis';
userFullNameSpan.style.whiteSpace = 'nowrap';
userFullNameSpan.className = 'userFullNameSpan'


userFullNameDiv.appendChild(userFullNameSpan);

function getUsersFromServer() {
    get(ref(dbRt, 'usersList/')).then((snap) => {
        let ents = Object.entries(snap.val());
        if (ents.length !== 0) {
            ents.forEach((res) => {
                const uid = res[0];
                const firstName = res[1].firstName;
                const lastName = res[1].lastName

                recipientId = res[0];
                get(ref(dbRt, 'usersList/' + uid + '/userPhoto')).then((snap) => {
                    const userPhotoURL = snap.val().userPhotoURL;
                    const json = JSON.parse(sessionStorage.getItem('user-info'));
                    let divv = document.createElement('div');
                    divv.innerHTML = getRegisteredUser(userPhotoURL, firstName, lastName)
                    selectUserParent.appendChild(divv)
                })
            })
        }
    })
}

function getRegisteredUser(userPhotoURL, firstName, lastName) {
    return `
                    <div class="selectUser" id="user1">
                    <div style="width: 45px; height: 45px; background-image: url(${userPhotoURL}); background-size: 100%; border-radius: 50%"></div>
                    <div style="font-size: 12px">
                        <span style="white-space: nowrap; overflow: hidden" class="userFullNameSpanMini" id="userFullNameSpanMini">${firstName} ${lastName}</span>
                    </div>
                    <div class="createChatButtonDiv" id="createChatButtonDiv">
                        <img src="images/icons/message.svg" alt="messageIcon" class="messageIcon">
                    </div>
                </div>
`
}

let userFullNameSpanMini = document.getElementById('userFullNameSpanMini');
userFullNameSpanMini.style.textOverflow = 'ellipsis';
userFullNameSpanMini.style.whiteSpace = 'nowrap';
userFullNameSpanMini.className = 'userFullNameSpanMini'




