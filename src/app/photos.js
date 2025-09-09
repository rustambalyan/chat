import {
    app,
    getFirebase,
    getSignedInUserUid,
    checkCred,
    getUniqueId,
    userPhotoCodeForModal,
    getDateAndTime,
    signOutConfirmCodeForModal,
    signOut,
    removeLoading,
    openModal,
    cancel,
    ref1, db
} from "./modules/modules.js";
import {addPhoto} from "./home.js";

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

window.onload = () => {
    checkCred();
    getFirebase(ref1(db, 'usersList/')).then((snap) => {
        snap.forEach(el => {
            let s = el.val();
            if (s.userPhoto !== undefined) {
                userPhotoURL = s.userPhoto.userPhotoURL;
            }
            const usersUid = s.uid;
            get(ref(db, 'usersList/' + getSignedInUserUid() + '/userPhoto')).then((snp) => {
                if (snp.val() !== null) {
                    currentUserPhotoURL = snp.val().userPhotoURL.toString();
                    if (snp.exists() && snp.val().userPhotoURL) {
                        if (usersUid === getSignedInUserUid()) {
                            userPhotoContainer.style.background = `url(${snp.val().userPhotoURL})`;
                            userPhotoContainer.style.backgroundSize = '128px';
                            userPhotoContainer.addEventListener("click", () => {
                                openModal(userPhotoCodeForModal(currentUserPhotoURL))
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
        removeLoading(loading)
        userFullNameSpan?.addEventListener('load', removeLoading)
        addPhotoIcon.addEventListener("click", () => {
            addPhoto(addPhotoInput, getFile)
        });
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

let addPhotoDiv = document.getElementById('addPhoto');

addPhotoDiv.addEventListener("click", () => {
    console.log('log')
    addPhoto()
})

