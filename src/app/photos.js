import {
    getStorage,
    uploadBytes,
    ref as sRef,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import {
    app,
    upload,
    getFirebase,
    setFirebase,
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
    getRef,
    db, storage, onV, upd,
} from "./modules/modules.js";

let currentUserPhotoURL = '';
let recipientPhotoURL = '';
let recipientId = '';
let messageId = '';
let userPhotoURL = 'images/userImages/userImageMan.jpg';
const signOutButton = document.getElementById('signOutButton');
const addPhotoDiv = document.getElementById('addPhotoDiv');
const addPhotoInput = document.getElementById('addPhotoInput');
const selectUserParent = document.getElementById('selectUserParent');
const userPhotoContainer = document.getElementById('userPhotoContainer');
const userFullNameDiv = document.getElementById('userFullNameDiv');
const messagesArea = document.getElementById('messagesArea');
const form = document.getElementById('form');
const loading = document.getElementById('loading');
let timeStamp;
let param = '';
let photosDiv = document.getElementById('photosDiv');

window.onload = () => {
    checkCred();
    getFirebase(getRef(db, 'usersList/')).then((snap) => {
        snap.forEach(el => {
            let s = el.val();
            if (s.userPhoto !== undefined) {
                userPhotoURL = s.userPhoto.userPhotoURL;
            }
            const usersUid = s.uid;
            getFirebase(getRef(db, 'usersList/' + getSignedInUserUid() + '/userPhoto')).then((snap) => {
                if (snap.val() !== null) {
                    // currentUserPhotoURL = snap.val().userPhotoURL.toString();
                    if (snap.exists() && snap.val().userPhotoURL) {
                        if (usersUid === getSignedInUserUid()) {
                            userPhotoContainer.style.background = `url(${snap.val().userPhotoURL})`;
                            userPhotoContainer.style.backgroundSize = '128px';
                            userPhotoContainer.addEventListener("click", () => {
                                openModal(userPhotoCodeForModal(currentUserPhotoURL))
                            })
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
        removeLoading(loading)
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
            return new Promise(() => {
                let chatUser = document.querySelectorAll('.selectUser');
                chatUser.forEach(el => {
                    el.addEventListener('click', ev => {
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

addPhotoDiv.addEventListener("click", res => {
    addPhotoInput.click();
    addPhotoInput.onchange = ev => {
        let file = ev.target.files[0]
        upload(file)
    };



})

// let addPhotoCode = `
//     <div id="photo" class="photo">
//         <img src=${param} alt="addPhoto" style="width: 50%">
//     </div>
// `
let userPhotosCode = `
    <div id="photo" class="photo">
        <img src="${param}" alt="addPhoto" style="width: 50%">
    </div>
`

// function drawAddPhotoDiv() {
//     let photosDiv = document.getElementById('photosDiv');
//     let photo = document.createElement('div');
//     photo.innerHTML = addPhotoCode;
//
//     photosDiv.appendChild(photo);
// }

function drawPhotosDiv(param){
    let photo = document.createElement('div');
    photo.innerHTML = `
    <div id="photo" class="photo">
        <img src="${param}" alt="addPhoto" style="width: 100%; border-radius: 15px">
        <span class="setAsMainPhoto" id="${param}">Set as main photo</span>
    </div>
`;
    photosDiv.appendChild(photo);
}

// getFirebase(getRef(db, 'usersList/' + getSignedInUserUid() + '/userPhoto')).then(res => {
//     console.log('hello')
//     res.forEach((r) => {
//         param = r.val();
//         drawPhotosDiv()
//     });
// })

onV(getRef(db, 'usersList/' + getSignedInUserUid() + '/userPhoto'), (res => {
    photosDiv.innerHTML = ''
    res.forEach((r) => {
        param = r.val();
        drawPhotosDiv(param);
    });
    setAsMainPhoto()
})).then()

function setAsMainPhoto(){
    let el = document.getElementsByClassName('setAsMainPhoto');
    for (let i = 0; i < el.length; i++) {
        el[i].addEventListener('click', ev => {
            userPhotoURL = ev.target.id.toString();
            upd(getRef(db, 'usersList/' + getSignedInUserUid()), {
                userPhotoURL: userPhotoURL
            })
        });
    }
}
setUserProfilePhoto()