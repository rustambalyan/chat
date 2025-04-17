import {initializeApp, onLog} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    doc,
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
    set,
    get,
    ref,
    getDatabase,
    onChildAdded, onValue
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
const db = getDatabase();
const dbRef = ref(db);
const auth = getAuth();
const storage = getStorage(app);
let firstName = '';
let lastName = '';
// let usersUid = '';
let signedInUserPhotoUrl = '';
let recipientPhotoUrl = '';
let recipientId = '';
let isClicked = false;
let messageId = '';


const signOutButton = document.getElementById('signOutButton');
const loadingDiv = document.getElementById('loadingDivParent');
const createChatButtonDiv = document.getElementById('createChatButtonDiv');
const addPhotoIcon = document.getElementById('addPhotoIcon');
const addPhotoInput = document.getElementById('addPhotoInput');
const selectUserParent = document.getElementById('selectUserParent');
const userPhotoContainer = document.getElementById('userPhotoContainer');
const userFullNameDiv = document.getElementById('userFullNameDiv');
const messagesArea = document.getElementById('messagesArea');
const sendButton = document.getElementById('sendButton');
const form = document.getElementById('form');
let loading = document.getElementById('loading');

getSignedInUserUid()


/////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////

// let selectedUser = document.querySelectorAll('.selectUser');
// selectedUser.forEach((user) => {
//     const userName = user.innerText;
//     user.addEventListener('click', openChat);
// })


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


// let userFullNameSpanMini = document.getElementById('userFullNameSpanMini');
// userFullNameSpanMini.style.textOverflow = 'ellipsis';
// userFullNameSpanMini.style.whiteSpace = 'nowrap';
// userFullNameSpanMini.className = 'userFullNameSpanMini'

window.onload = () => {
    checkCred();
    get(ref(db, 'usersList/')).then((snap) => {
        snap.forEach(el => {
            let s = el.val();
            let userPhotoURL = 'images/userImages/userImageMan.jpg';
            if (s.userPhoto !== undefined) {
                userPhotoURL = s.userPhoto.userPhotoURL;
                recipientPhotoUrl = s.userPhoto.userPhotoURL;
            }
            const usersUid = s.uid;
            const userInfoMini = document.createElement('div');
            userInfoMini.innerHTML = `
                    <div class="selectUser" id="${usersUid}">
                    <div style="width: 45px; height: 45px; background-image: url(${userPhotoURL}); background-size: 100%; border-radius: 50%" id="${usersUid}"></div>
                        <span style="display: inline-block; max-width: 60px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; font-size: 10px" id="${usersUid}">${s.firstName} ${s.lastName}</span>
`;
            if (s.uid !== getSignedInUserUid()) {
                selectUserParent.appendChild(userInfoMini);
            }


            get(ref(db, 'usersList/' + getSignedInUserUid() + '/userPhoto')).then((snp) => {
                signedInUserPhotoUrl = snp.val().userPhotoURL.toString();
                console.log(signedInUserPhotoUrl.toString())
                if (snp.exists() && snp.val().userPhotoURL) {
                    if (usersUid === getSignedInUserUid()) {
                        userPhotoContainer.style.background = `url(${snp.val().userPhotoURL})`;
                        userPhotoContainer.style.backgroundSize = '128px';
                        addPhotoIcon.remove()
                    }

                } else {
                    userPhotoContainer.style.background = `url(images/userImages/userImageMan.jpg)`;
                    userPhotoContainer.style.backgroundSize = '128px';
                }
            })


        })


        // if (snap.exists() && snap.val().userPhotoURL === getSignedInUserUid()) {
        //     console.log('log3')
        //     userPhotoContainer.style.background = `url("images/userImages/userImageMan.jpg")`;
        //     userPhotoContainer.style.backgroundSize = '128px';
        // }
        // userPhotoContainer.style.background = `url(${snap.val().userPhoto.userPhotoURL})`;
        // userPhotoContainer.style.backgroundSize = '128px';
        // addPhotoIcon.remove()


        // snap.forEach(snapUid => {
        //
        //     if (snap.exists() && snapUid.val().uid === getSignedInUserUid()) {
        //         if (snap.userPhoto === undefined) {
        //             console.log('log1')
        //             userPhotoContainer.style.background = `url("images/userImages/userImageMan.jpg")`;
        //             userPhotoContainer.style.backgroundSize = '128px';
        //         } else {
        //             console.log('log2')
        //             console.log(snap.val().userPhoto.userPhotoURL)
        //             userPhotoContainer.style.background = `url(${snap.val().userPhoto.userPhotoURL})`;
        //             userPhotoContainer.style.backgroundSize = '128px';
        //             addPhotoIcon.remove()
        //         }
        //     } else {
        //         console.log('log3')
        //         userPhotoContainer.style.background = `url("images/userImages/userImageMan.jpg")`;
        //         userPhotoContainer.style.backgroundSize = '128px';
        //     }
        // })

        const userFullNameSpan = document.createElement('span');
        const firstName = JSON.parse(sessionStorage.getItem('user-info')).firstName;
        const lastName = JSON.parse(sessionStorage.getItem('user-info')).lastName;

        userFullNameSpan.innerText = firstName + ' ' + lastName;
        userFullNameSpan.style.textOverflow = 'ellipsis';
        userFullNameSpan.style.whiteSpace = 'nowrap';
        userFullNameSpan.style.fontSize = '18px'
        userFullNameSpan.className = 'userFullNameSpan'
        userFullNameDiv.appendChild(userFullNameSpan);
        removeLoading()


        userFullNameSpan?.addEventListener('load', removeLoading)


        addPhotoIcon.addEventListener("click", addPhoto);
        signOutButton.addEventListener('click', signOut);


        async function getEl() {
            await gt()
        }

        function gt() {
            clearMessageArea()

            return new Promise(() => {
                let chatUser = document.querySelectorAll('.selectUser');
                chatUser.forEach(el => {
                    el.addEventListener('click', ev => {
                        clearMessageArea();
                        recipientId = ev.target.id;
                        let mainCont = document.getElementById('mainContent');
                        if (getSignedInUserUid() !== ev.target.id) {
                            mainCont.style.display = 'block';
                        }
                        getMessages(recipientId).then();

                        // set(ref(dbRt, 'chatsList/' + getSignedInUserUid() + recipientId + '/messages/' + Date.now()), {
                        //     text: 'Welcome',
                        //     timeStamp: Date.now()
                        // })
                    })
                })
            })
        }

        getEl()



        //     form.addEventListener('submit', (evt) => {
        //         evt.preventDefault();
        //         let message = messageInput.value;
        //         const message=Text = messageInput.value.trim();
        //         if (messageText !== '') {
        //             sendMessage(message);
        //             messageInput.value = ''
        //         }

        //     })
        // })


        // selectUserParent.addEventListener("click", ev => {
        //     if (ev && isClicked) {
        //         if (ev.target !== selectUserParent) {
        //             recipientId = ev.target.id;
        //             if (recipientId) {
        //                 console.log(recipientId)
        //                 createChat(recipientId, isClicked)
        //             }

        //         }
        //     }
        //     if (ev.target.id !== recipientId) {
        //         isClicked = true;
        //         recipientId = ev.target.id;
        //         // createChat(recipientId, isClicked);
        //         let children = messagesArea.children;

        //         for (let i = 0; i < children.length; i++) {
        //             children[i].textContent = null
        //             console.log(i)
        //         }

        //     }


        // })


        //     const noMessages = document.createElement('div');
        //     if (messagesArea.childNodes.length === 1) {
        //         noMessages.id = 'noMessages'
        //         noMessages.innerHTML = `
        //    <div style="width: 320px; height: 200px; display: flex; justify-content: center; align-items: center ">
        //         <span>There are no messages</span>
        //     </div>
        // `
        //         messagesArea.appendChild(noMessages);
        //         setTimeout(() => loadingDiv.remove(), 1500)

        //     } else {
        //         noMessages.remove();
        //         onChildAdded(ref(dbRt, 'chatsList/' + getSignedInUserUid() + arr[0].uid + '/messages/'), (snap) => {
        //             if (snap.exists) {
        //                 displayMessage(snap.val().text);
        //                 scrollBottom()
        //             }
        //             loadingDiv.remove();
        //         })
        //         setTimeout(() => loadingDiv.remove(), 1500)

        //     }
        //     onChildAdded(ref(dbRt, 'chatsList/' + getSignedInUserUid() + arr[0].uid + '/messages/'), (snap) => {
        //         if (snap.exists) {
        //             console.log(snap.val())
        //             displayMessage(snap.val().text);
        //             scrollBottom()
        //         }
        //         noMessages.remove();
        //     })
    })
}


form.addEventListener('submit', (e) => {
    const messageInput = document.getElementById('messageInput');
    if (messageInput.value.replace(/\s+/g, '') !== '') {
    } else {
        messageInput.value = '';
    }
    createMessage(getSignedInUserUid(), recipientId, messageInput.value).then();
    messageInput.value = '';


    e.preventDefault()
});

let messageArray = [];

async function getChat(recipientId) {
    await get(ref(db, 'chatsList/' + getSignedInUserUid() + recipientId + '/messages/')).then(snap => {
        snap.forEach(val => {
            messageArray.push(val.val().text);
        })
    })
}

// function createChat(recipientId) {
//     set(ref(dbRt, 'chatsList/' + getSignedInUserUid() + recipientId + '/messages/' + Date.now()), { text: 'Welcome to chat', timeStamp: Date.now() }).then(() => {
//         // onChildAdded(ref(dbRt, 'chatsList/' + getSignedInUserUid() + recipientId + '/messages/'), (snap) => {
//         //     if (snap.exists) {
//         //         // displayMessage(snap.val().text);
//         //         // scrollBottom();
//         //     }
//         //     // noMessages.remove();
//         // })
//     })

//     onValue(ref(dbRt, 'chatsList/'), (snap) => {
//         if (snap.exists) {
//             snap.forEach((val) => {
//                 console.log(val.text)
//                 if (val.key.includes(getSignedInUserUid() && recipientId)) {
//                     messageId = val.key;
//                     onChildAdded(ref(dbRt, 'chatsList/' + val.key + '/messages/'), (snap) => {
//                         if (snap.exists) {
//                             displayMessage(snap.val().text);
//                             scrollBottom();
//                         }
//                         // noMessages.remove();
//                     })
//                 }

//             })
//         }
//     })


//     isClicked = false


//     // const messagesArea = document.getElementById('messagesArea');
//     // const sendingMessage = document.createElement('div');
//     // sendingMessage.innerHTML = createSendingMessage(message);
//     // messagesArea.appendChild(sendingMessage);
//     // scrollBottom()
// }


function openLoading() {
    let el = `
            <img src="images/animations/loading-animation-200px.svg" alt="loading">
    `
    let loading = document.createElement('div');
    loading.innerHTML = el;
    loadingDiv.appendChild(loading)
}

function addPhoto() {
    addPhotoInput.click();
    getFile()
}

function createSendingMessage(data) {
    return `
                    <div id="sentMessage" class="sentMessage">
                        <div style="min-width: 260px; width: 80%; height: 100%; background-color: #4165f3; border-radius: 20px">
                            <span>
                                <div style="padding: 3px; margin: 11px; max-width: 260px; color: white; word-wrap: break-word">${data}</div>
                            </span>
                        </div>
                        <div style="display: flex; justify-content: center; align-items: center; width: 60px; height: 100%">
                            <div style="width: 45px; height: 45px; background-image: url(${signedInUserPhotoUrl}); background-size: 100%; border: 0 solid; border-radius: 50px">
                            </div>
                        </div>
                    </div>
`
}

function createReceivingMessage(data) {
    return `
                    <div id="receivedMessage" class="receivedMessage">
                        <div style="display: flex; justify-content: center; align-items: center; width: 60px; height: 100%">
                            <div style="width: 45px; height: 45px; background-image: url(${recipientPhotoUrl}); background-size: 100%; border: 0 solid; border-radius: 50px">
                            </div>
                        </div>
                        <div style="min-width: 260px; height: 100%; background-color: #e5e6ea; border-radius: 20px">
                        <span>
                            <div style="padding: 3px; margin: 11px; max-width: 260px; color: black; word-wrap: break-word">${data}</div>
                        </span>
                        </div>
                    </div>
`
}

function setUserProfilePhoto(res) {
    if (res) {
        userPhotoContainer.style.background = `url(${res})`;
        userPhotoContainer.style.backgroundSize = '128px';
        addPhotoIcon.remove()
    } else {
        userPhotoContainer.style.background = `url("images/userImages/userImageMan.jpg")`
    }
}

function upload(file) {
    const storageRef = sRef(storage, 'userPhoto/' + getSignedInUserUid() + '/' + file.name);
    uploadBytes(storageRef, file).then(() => {
        getFileFromStorage(file)
    })
}

function getFileFromStorage(file) {
    const storageRef = sRef(storage, 'userPhoto/' + getSignedInUserUid() + '/' + file.name);

    getDownloadURL(storageRef).then((res) => {
        set(ref(db, 'usersList/' + getSignedInUserUid() + '/userPhoto'), {userPhotoURL: res});
        setUserProfilePhoto(res)
    })

}

function getFile() {
    addPhotoInput.addEventListener("change", (res) => {
        const file = res.target.files[0];
        upload(file)
    });
}

function displayMessage(message) {
    // const messagesArea = document.getElementById('messagesArea');
    const sendingMessage = document.createElement('div');
    sendingMessage.innerHTML = createSendingMessage(message);
    sendingMessage.id = 'sendingMessageId';
    messagesArea.appendChild(sendingMessage);
    scrollBottom();
    // loadingDiv.remove()
}

function displayReceivedMessage(message) {
    // const messagesArea = document.getElementById('messagesArea');
    const receivedMessage = document.createElement('div');
    receivedMessage.innerHTML = createReceivingMessage(message);
    receivedMessage.id = 'receivedMessageId';
    messagesArea.appendChild(receivedMessage);
    scrollBottom();
    // loadingDiv.remove()
}

function clearMessageArea() {
    while (messagesArea.firstChild) {
        messagesArea.removeChild(messagesArea.firstChild)
    }
}


function scrollBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function signOut(evt) {
    sessionStorage.removeItem('user-creds');
    sessionStorage.removeItem('user-info');
    window.location.replace('index.html')
    evt.preventDefault();
}

function checkCred() {
    if (!sessionStorage.getItem('user-creds')) {
        window.location.href = 'index.html'
    }
}

function removeLoading() {
    loading.remove()
}

function getSignedInUserUid() {
    if (sessionStorage.getItem('user-creds')) {
        return JSON.parse(sessionStorage.getItem('user-creds')).uid
    }
}


async function getMessages() {
    await onValue(ref(db, "messages/"), (sss) => {
        clearMessageArea()
        sss.forEach(item => {
            let messArr = [];
            if (getSignedInUserUid() === item.val().sender && recipientId === item.val().recipient) {
                messArr.push(item.val().text)
                displayMessage(messArr.map(m => m));
                console.log('1')

            }
            if (getSignedInUserUid() === item.val().recipient && recipientId === item.val().sender) {
                messArr.push(item.val().text)
                displayMessage(messArr.map(m => m));
                console.log('2')
            }
        })
    })
}

async function createMessage(currentUserId, recipientId, message) {
    await set(ref(db, 'messages/' + Date.now()), {
        sender: currentUserId,
        recipient: recipientId,
        text: message,
        timeStamp: Date.now()
    })
}