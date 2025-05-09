import {initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    set,
    get,
    remove,
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

const firebaseConfig = {
    apiKey: "AIzaSyAcjkoMZcttxOBHOFqITeg0ajyFJhCx9OY",
    authDomain: "chatapp-5d0f0.firebaseapp.com",
    databaseURL: "https://chatapp-5d0f0-default-rtdb.firebaseio.com",
    projectId: "chatapp-5d0f0",
    storageBucket: "chatapp-5d0f0.appspot.com",
    messagingSenderId: "361463095812",
    appId: "1:361463095812:web:d78f96e5fc72195f828b51"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const storage = getStorage(app);
let currentUserPhotoURL = '';
let recipientPhotoURL = '';
let recipientId = '';
let messageId = '';
let userPhotoURL = 'images/userImages/userImageMan.jpg';
const signOutButton = document.getElementById('signOutButton');
const addPhotoIcon = document.getElementById('addPhotoIcon');
const addPhotoInput = document.getElementById('addPhotoInput');
const selectUserParent = document.getElementById('selectUserParent');
const userPhotoContainer = document.getElementById('userPhotoContainer');
const userFullNameDiv = document.getElementById('userFullNameDiv');
const messagesArea = document.getElementById('messagesArea');
const form = document.getElementById('form');
const loading = document.getElementById('loading');
let timeStamp;

getSignedInUserUid();

window.onload = () => {
    checkCred();
    get(ref(db, 'usersList/')).then((snap) => {
        snap.forEach(el => {
            let s = el.val();
            if (s.userPhoto !== undefined) {
                userPhotoURL = s.userPhoto.userPhotoURL;
            }
            const usersUid = s.uid;
            const userInfoMini = document.createElement('div');
            userInfoMini.innerHTML = `
                    <div class="selectUser" id="${usersUid}">
                    <div data-userphotourl = "${userPhotoURL}" style="width: 45px; height: 45px; background-image: url(${userPhotoURL}); background-size: 100%; border-radius: 50%" id="${usersUid}"></div>
                        <span style="display: inline-block; max-width: 60px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; font-size: 10px" id="${usersUid}">${s.firstName} ${s.lastName}</span>
`;
            if (s.uid !== getSignedInUserUid()) {
                selectUserParent.appendChild(userInfoMini);
            }


            get(ref(db, 'usersList/' + getSignedInUserUid() + '/userPhoto')).then((snp) => {
                if (snp.val() !== null) {
                    currentUserPhotoURL = snp.val().userPhotoURL.toString();
                    if (snp.exists() && snp.val().userPhotoURL) {
                        if (usersUid === getSignedInUserUid()) {
                            userPhotoContainer.style.background = `url(${snp.val().userPhotoURL})`;
                            userPhotoContainer.style.backgroundSize = '128px';
                            userPhotoContainer.addEventListener("click", () => {
                                openModal(userPhotoCodeForModal())
                            })
                            addPhotoIcon.remove()
                        }

                    }
                } else {
                    userPhotoContainer.style.background = `url(images/userImages/userImageMan.jpg)`;
                    userPhotoContainer.style.backgroundSize = '128px';

                }
            })


        })

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
        signOutButton.addEventListener('click', () => {
            openModal(signOutConfirmCodeForModal());
            signOut();
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

form.addEventListener('submit', (e) => {
    const messageInput = document.getElementById('messageInput');
    if (messageInput.value.replace(/\s+/g, '') !== '') {
        createMessage(getSignedInUserUid(), currentUserPhotoURL, recipientPhotoURL, recipientId, messageInput.value).then();
        messageInput.value = '';
        e.preventDefault()
    } else {
        messageInput.value = '';
    }
});

function addPhoto() {
    addPhotoInput.click();
    getFile()
}

function createSendingMessage(data) {
    if (currentUserPhotoURL !== '') {
        return `
            <div style="display: flex; justify-content: space-between;" id="sentMessage" class="sentMessage">
                <div style="display: flex; flex-direction: column">
                    <div style="min-width: 260px; width: 80%; height: 100%; background-color: #4165f3; border-radius: 20px; display: flex; align-items: center">
                        <span>
                            <div style="padding: 3px; margin: 11px; max-width: 260px; color: white; word-wrap: break-word">${data}
                            </div>
                        </span>
                    </div>
                    <span style="color: #313030; font-size: .7rem; display: flex; justify-content: flex-end">${getDateAndTime(timeStamp)}
                    </span>
                </div>                    
                <div style="width: 60px; height: 100%; display: flex; justify-content: center">
                    <img src="${currentUserPhotoURL}" alt="senderPhotoURL" style="width: 55px; border-radius: 50px">
                </div>
                <div class='sendingMessage' style="width: 20px; height: 20px">
                    <div id="${messageId}" class="deleteMessage">
                    </div>
                </div>
            </div>
        `
    } else {
        currentUserPhotoURL = 'gs://chatapp-5d0f0.appspot.com/userImageMan.jpg'
    }
}

function createReceivingMessage(message, recipientPhotoURL) {
    return `
        <div id="receivedMessage" class="receivedMessage">
            <div style="width: 60px; height: 100%; display: flex; justify-content: center">
                <img src="${recipientPhotoURL}" alt="receiverPhoto" style="width: 55px; border-radius: 50px">
            </div>
            <div style="display: flex; flex-direction: column">
                <div style="min-width: 260px; width: 80%; height: 100%; background-color: #e5e6ea; border-radius: 20px; display: flex; align-items: center">
                    <span>
                        <div style="padding: 3px; margin: 11px; max-width: 260px; color: black; word-wrap: break-word">${message}
                        </div>
                    </span>
                </div>
                <span style="color: #313030; font-size: .7rem; display: flex; justify-content: flex-end">${getDateAndTime(timeStamp)}</span>
            </div>
            <div class='receivingMessage' style="width: 20px; height: 20px">
                <div id="${messageId}" class="deleteMessage">
                </div>                        
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

function sOut(evt) {
    sessionStorage.removeItem('user-creds');
    sessionStorage.removeItem('user-info');
    window.location.replace('index.html');
    evt.preventDefault()
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
    const uniqueId = getUniqueId()
    await set(ref(db, 'messages/' + uniqueId), {
        senderId: currentUserId,
        senderPhotoURL: signedInUserPhotoUrl,
        recipientPhotoURL: recipientPhotoURL,
        recipientId: recipientId,
        messageId: uniqueId,
        messageText: message,
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

function getUniqueId() {
    return `${Date.now().toString(36)}` + `${Math.random().toString(36).slice(2)}`;
}

function getDateAndTime(timeStamp) {
    return new Date(timeStamp).toLocaleTimeString([], {day: "2-digit", month: "2-digit",  year: "2-digit", hour: '2-digit', minute: '2-digit'});
}

function openModal(data){
    let body = document.getElementsByTagName("body")[0];
    let modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal';
    modal.innerHTML = data;
    body.appendChild(modal);
    const closeModalIcon = document.getElementById("closeModalIcon");
    if(closeModalIcon){
        closeModalIcon.addEventListener("click", () => {
            closeModal()
        })
    }
}

function closeModal() {
    document.getElementById('modal').remove()
}

function userPhotoCodeForModal(){
    return `
        <div class="boxInnerModal">
            <img src=${currentUserPhotoURL} alt="userPhoto" width="65%">
        </div>
        <div class = "closeModalIcon" id="closeModalIcon">
        </div>
    `
}
function signOutConfirmCodeForModal() {
    return `
        <div style="border-radius: 10px; background-color: #e5e7ec; width: 320px; height: 150px; display: flex; align-items: center; justify-content: center">
            <div style="width: 80%; display: flex; justify-content: space-evenly; align-items: center; cursor: default">
                <div id="signOutConfirmButton" onclick="signOut()" style="border-radius: 5px; width: 120px; height: 40px; background-color: #2660ad; color: #d7dadf; display: flex; justify-content: center; align-items: center">Sign Out
                </div>
                <div style="border-radius: 5px; width: 100px; height: 40px; background-color: dimgray; color: #d7dadf; display: flex; justify-content: center; align-items: center; cursor: default">Cancel
                </div>
            </div>
        </div>
    `
}

function signOut() {
    const signOutButton = document.getElementById("signOutConfirmButton");
    signOutButton.addEventListener("click", event => {
        sOut(event)
    })
}