import {app, db, getRef} from "./modules/modules.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    set,
    get,
    remove,
    update,
    ref,
    getDatabase,
    onValue
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import {
    getStorage,
    uploadBytes,
    ref as sRef,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

import {
    getSignedInUserUid,
    checkCred,
    getUniqueId,
    userPhotoCodeForModal,
    getDateAndTime,
    signOutConfirmCodeForModal,
    setUserProfilePhoto,
    signOut,
    removeLoading,
    openModal,
    cancel,
    storage,
    userPhotoContainer
} from "./modules/modules.js";

const firebaseConfig = {
    apiKey: "AIzaSyAcjkoMZcttxOBHOFqITeg0ajyFJhCx9OY",
    authDomain: "chatapp-5d0f0.firebaseapp.com",
    databaseURL: "https://chatapp-5d0f0-default-rtdb.firebaseio.com",
    projectId: "chatapp-5d0f0",
    storageBucket: "chatapp-5d0f0.appspot.com",
    messagingSenderId: "361463095812",
    appId: "1:361463095812:web:d78f96e5fc72195f828b51"
};


let currentUserPhotoURL = '';
let recipientPhotoURL = '';
let recipientId = '';
let messageId = '';
let userPhotoURL = 'images/userImages/userImageMan.jpg';
const signOutButton = document.getElementById('signOutButton');
const selectUserParent = document.getElementById('selectUserParent');
const userFullNameDiv = document.getElementById('userFullNameDiv');
const messagesArea = document.getElementById('messagesArea');
const form = document.getElementById('form');
const loading = document.getElementById('loading');
let timeStamp;

window.onload = () => {
    checkCred();
    getMessageFromInput();
    get(ref(db, 'usersList/')).then((snap) => {
        snap.forEach(el => {
            let s = el.val();
            if (s.userPhoto !== undefined) {
                userPhotoURL = s.userPhotoURL;
            }
            const usersUid = s.uid;
            const userInfoMini = document.createElement('div');
            userInfoMini.innerHTML = `
                    <div class="selectUser" id="${usersUid}">
                    <div data-userphotourl = "${userPhotoURL}" style="width: 45px; height: 45px; background-image: url(${userPhotoURL}); background-size: 100%; border-radius: 50%" id="${usersUid}"></div>
                        <span style="display: inline-block; max-width: 60px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; font-size: 10px" id="${usersUid}">${s.firstName} ${s.lastName}</span>
`;
            userPhotoURL = 'https://firebasestorage.googleapis.com/v0/b/chatapp-5d0f0.appspot.com/o/userImageMan.jpg?alt=media&token=082bb935-b74e-4edc-8f90-77ad47ad2a0d';
            if (s.uid !== getSignedInUserUid()) {
                selectUserParent.appendChild(userInfoMini);
            }


            get(ref(db, 'usersList/' + getSignedInUserUid() + '/userPhotoURL')).then((snp) => {
                if (snp.val() !== null) {
                    console.log(snp.val())
                    currentUserPhotoURL = snp.val();
                    userPhotoContainer.addEventListener("click", ev => {
                        openModal(userPhotoCodeForModal(currentUserPhotoURL))
                    })
                } else {
                    userPhotoContainer.style.background = `url(images/userImages/userImageMan.jpg)`;
                    userPhotoContainer.style.backgroundSize = '128px';

                }
            })


        })
        setUserProfilePhoto()

        const userFullNameSpan = document.createElement('span');
        const firstName = JSON.parse(sessionStorage.getItem('user-info')).firstName;
        const lastName = JSON.parse(sessionStorage.getItem('user-info')).lastName;

        userFullNameSpan.innerText = firstName + ' ' + lastName;
        userFullNameSpan.style.textOverflow = 'ellipsis';
        userFullNameSpan.style.whiteSpace = 'nowrap';
        userFullNameSpan.style.fontSize = '18px'
        userFullNameSpan.className = 'userFullNameSpan'
        userFullNameDiv.appendChild(userFullNameSpan);
        removeLoading(loading);
        userFullNameSpan?.addEventListener('load', removeLoading);
        signOutButton.addEventListener('click', () => {
            openModal(signOutConfirmCodeForModal());
            signOut();
            cancel()
        });

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
                        recipientPhotoURL = ev.target.dataset.userphotourl;
                        let mainCont = document.getElementById('mainContent');
                        let chatWith = document.getElementById('chatWith');
                        if (getSignedInUserUid() !== ev.target.id) {
                            mainCont.style.display = 'block';
                            get(ref(db, 'usersList/' + recipientId)).then(snap => {
                                let chatNameHTML =
                                    `
                                        <span>Chat with ${snap.val().firstName}</span>
                                    `;
                                let child = document.createElement('span');
                                child.id = 'chatNameHTMLChild'
                                child.innerHTML = chatNameHTML;
                                let getChild = document.getElementById('chatWith');
                                getChild.style.display = 'flex';
                                getChild.style.justifyContent = 'center'
                                if (getChild.firstChild) {
                                    chatWith.removeChild(getChild.firstChild);
                                }
                                chatWith.appendChild(child);
                            })
                        }
                        getMessages(recipientId).then();
                        getDateAndTime()
                    })
                })
            })
        }
        getEl().then()
    })
}

function getMessageFromInput(){
    form.addEventListener('submit', (e) => {
        const messageInput = document.getElementById('messageInput');
        if (messageInput.value.replace(/\s+/g, '') !== '') {
            console.log(getSignedInUserUid(), currentUserPhotoURL, recipientPhotoURL)
            createMessage(getSignedInUserUid(), currentUserPhotoURL, recipientPhotoURL, recipientId, messageInput.value).then();
            messageInput.value = '';
            e.preventDefault()
        } else {
            messageInput.value = '';
        }
    });
}

function createSendingMessage(data) {
    if (currentUserPhotoURL === '') {
        currentUserPhotoURL = 'https://firebasestorage.googleapis.com/v0/b/chatapp-5d0f0.appspot.com/o/userImageMan.jpg?alt=media&token=082bb935-b74e-4edc-8f90-77ad47ad2a0d'
    }
    return `
            <div style="display: flex; justify-content: space-between; align-items: center" id="sentMessage" class="sentMessage">
                <div style="display: flex; flex-direction: column">
                    <div style="min-width: 155px; width: 80%; height: 100%; background-color: #4165f3; border-radius: 20px; display: flex; align-items: center">
                        <span>
                            <div style="padding: 3px; margin: 11px; max-width: 260px; color: white; word-wrap: break-word">${data}
                            </div>
                        </span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                    
                    <span style="color: #313030; font-size: .7rem; display: flex; justify-content: flex-end">${getDateAndTime(timeStamp)}
                    </span>
                    <div class='sendingMessage' style="width: 13px; height: 13px">
                        <div id="${messageId}" class="deleteMessage">
                        </div>
                    </div>
                    </div>
                    
                    
                </div>                    
                <div style="width: 60px; height: 100%; display: flex; justify-content: center">
                    <img src="${currentUserPhotoURL}" alt="senderPhotoURL" style="width: 30px; border-radius: 50px">
                </div>
                
            </div>
        `
}

function createReceivingMessage(message, recipientPhotoURL) {
    return `
        <div id="receivedMessage" class="receivedMessage">
            <div style="width: 40px; height: 100%; display: flex; justify-content: center">
                <img src="${recipientPhotoURL}" alt="receiverPhoto" style="width: 30px; border-radius: 50px">
            </div>
            <div style="display: flex; flex-direction: column">
                <div style="height: 100%; background-color: #e5e6ea; border-radius: 20px; display: flex; align-items: center">
                    <span style="width: 155px">
                        <div style="padding: 3px; margin: 11px; max-width: 260px; color: black; word-wrap: break-word">${message}
                        </div>
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between; justify-items: flex-end">
                            <span style="color: #313030; font-size: .7rem; display: flex; justify-content: flex-end">${getDateAndTime(timeStamp)}</span>

            <div class='receivingMessage' style="width: 13px; height: 13px">
                <div id="${messageId}" class="deleteMessage">
                </div>                        
            </div>

</div>
            </div>

        </div>
    `
}

function displaySentMessage(message) {
    return new Promise(() => {
        const sendingMessage = document.createElement('div');
        sendingMessage.innerHTML = createSendingMessage(message);
        sendingMessage.id = 'sendingMessageId';
        messagesArea.appendChild(sendingMessage);
        scrollBottom()
    })
}

function displayReceivedMessage(message) {
    const receivedMessage = document.createElement('div');
    receivedMessage.innerHTML = createReceivingMessage(message, recipientPhotoURL);
    receivedMessage.id = 'receivedMessageId';
    messagesArea.appendChild(receivedMessage);
    scrollBottom()
}

function clearMessageArea() {
    while (messagesArea.firstChild) {
        messagesArea.removeChild(messagesArea.firstChild)
    }
}

function scrollBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight
}



async function getMessages() {
    await onValue(ref(db, "messages/"), (sss) => {
        clearMessageArea();
        sss.forEach(item => {
            if (getSignedInUserUid() === item.val().senderId && recipientId === item.val().recipientId) {
                messageId = item.val().messageId;
                timeStamp = item.val().timeStamp;
                currentUserPhotoURL = item.val().senderPhotoURL;
                displaySentMessage(item.val().messageText);
                deleteMessage()
            }
            if (getSignedInUserUid() === item.val().recipientId && recipientId === item.val().senderId) {
                messageId = item.val().messageId;
                timeStamp = item.val().timeStamp;
                currentUserPhotoURL = item.val().recipientPhotoURL;
                displayReceivedMessage(item.val().messageText);
                deleteMessage()
            }
        })
    })
}

async function createMessage(currentUserId, signedInUserPhotoUrl, recipientPhotoURL, recipientId, message) {
    if (signedInUserPhotoUrl === '') {
        signedInUserPhotoUrl = currentUserPhotoURL
    }
    const uniqueId = getUniqueId();
    await set(ref(db, 'messages/' + uniqueId), {
        senderId: currentUserId,
        senderPhotoURL: currentUserPhotoURL,
        recipientPhotoURL: recipientPhotoURL,
        recipientId: recipientId,
        messageId: uniqueId,
        messageText: message,
        isRead: false,
        timeStamp: Date.now()
    })
}

function deleteMessage() {
    let el = document.querySelectorAll('.deleteMessage');
    el.forEach(i => {
        i.addEventListener('click', item => {
            remove(ref(db, 'messages/' + item.target.id))
        })
    })
}

// Notification.requestPermission().then(function (permission) {
//     if (permission === "granted") {
//         console.log("Notification permission granted.");
//         // Now you can create and display notifications
//     } else {
//         console.log("Notification permission denied.");
//     }
// });
//
// function spawnNotification(title, body, icon) {
//     var options = {
//         body: body,
//         icon: icon,
//     };
//     var notification = new Notification(title, options);
//
//     // Optional: Add event listeners for notification interactions
//     notification.onclick = function() {
//         console.log("Notification clicked!");
//         // Perform actions when the notification is clicked
//     };
//     notification.onclose = function() {
//         console.log("Notification closed.");
//     };
// }

// Example usage after permission is granted
// spawnNotification("New Message", "You have a new message from a friend.", "path/to/icon.png");