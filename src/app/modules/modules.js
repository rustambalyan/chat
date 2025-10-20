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

export const userPhotoContainer = document.getElementById('userPhotoContainer');

export function getFirebaseConfig(){
    return {
        apiKey: "AIzaSyAcjkoMZcttxOBHOFqITeg0ajyFJhCx9OY",
        authDomain: "chatapp-5d0f0.firebaseapp.com",
        databaseURL: "https://chatapp-5d0f0-default-rtdb.firebaseio.com",
        projectId: "chatapp-5d0f0",
        storageBucket: "chatapp-5d0f0.appspot.com",
        messagingSenderId: "361463095812",
        appId: "1:361463095812:web:d78f96e5fc72195f828b51"
    }
}
export const app = initializeApp(getFirebaseConfig());
export const db = getDatabase(app);
export function ref1(db, path){
    path = 'usersList/'
    ref(db, path);
}

export function getSignedInUserUid() {
    if (sessionStorage.getItem('user-creds')) {
        return JSON.parse(sessionStorage.getItem('user-creds')).uid
    }
}

export function checkCred() {
    if (!sessionStorage.getItem('user-creds')) {
        window.location.href = 'index.html'
    }
}

export function sOut(evt) {
    sessionStorage.removeItem('user-creds');
    sessionStorage.removeItem('user-info');
    window.location.replace('index.html');
    evt.preventDefault()
}

export function getUniqueId() {
    return `${Date.now().toString(36)}` + `${Math.random().toString(36).slice(2)}`;
}

export function userPhotoCodeForModal(currentUserPhotoURL){
    return `
        <div class="boxInnerModal">
                <img src=${currentUserPhotoURL} alt="userPhoto" width="65%">
                <button>Delete Photo</button>
        </div>
        <div class = "closeModalIcon" id="closeModalIcon">
        </div>
    `
}

export function getDateAndTime(timeStamp) {
    return new Date(timeStamp).toLocaleTimeString([], {day: "2-digit", month: "2-digit",  year: "2-digit", hour: '2-digit', minute: '2-digit'});
}

export function signOutConfirmCodeForModal() {
    return `
        <div style="border-radius: 10px; background-color: #e5e7ec; width: 320px; height: 150px; display: flex; align-items: center; justify-content: center">
            <div style="width: 80%; display: flex; justify-content: space-evenly; align-items: center; cursor: default">
                <div id="signOutConfirmButton" style="border-radius: 5px; width: 120px; height: 40px; background-color: #2660ad; color: #d7dadf; display: flex; justify-content: center; align-items: center">Sign Out
                </div>
                <div id="cancel" style="border-radius: 5px; width: 100px; height: 40px; background-color: dimgray; color: #d7dadf; display: flex; justify-content: center; align-items: center; cursor: default">Cancel
                </div>
            </div>
        </div>
    `
}

export function signOut() {
    const signOutButton = document.getElementById("signOutConfirmButton");
    signOutButton.addEventListener("click", event => {
        sOut(event)
    })
}

export function removeLoading(loading) {
    loading.remove()
}

export async function onV(arg1, arg2) {
    return onValue(arg1, arg2)
}

export function openModal(data){
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

export function cancel() {
    const cancelButton = document.getElementById("cancel");
    cancelButton.addEventListener("click", () => {
        closeModal()
    })
}

export function closeModal() {
    document.getElementById('modal').remove()
}

export const storage = getStorage(app);

export function getFirebase(arg){
    return get(arg)
}

export function setFirebase(arg1, arg2){
    return set(arg1, arg2)
}

export function getRef(arg1, arg2){
    return ref(arg1, arg2)
}

// export function getUserPhotos(){
//     const stRef = sRef(storage, 'userPhoto/' + getSignedInUserUid());
//     return getDownloadURL(stRef).then((res) => {
//         // set(ref(db, 'usersList/' + getSignedInUserUid() + '/userPhoto'), {userPhotoURL: res});
//         res.forEach(val => console.log(val))
//     })
//
//
// }

function getUserPhotoURL(file) {
    const storageRef = sRef(storage, 'userPhoto/' + getSignedInUserUid() + '/' + file.name);

    return getDownloadURL(storageRef).then((res) => {
        let objKey = Date.now();
        let userPhotoURLObj = {
            [objKey] : res
        };
        update(ref(db, 'usersList/' + getSignedInUserUid() + '/userPhoto'), userPhotoURLObj)
    })
}

export function upload(file) {
    const storageRef = sRef(storage, 'userPhoto/' + getSignedInUserUid() + '/' + file.name);
    uploadBytes(storageRef, file).then(() => {
        console.log(getUserPhotoURL(file))
    })
}

export function upd(arg1, arg2) {
    return update(arg1, arg2)
}

export function setUserProfilePhoto() {
    onValue(getRef(db, 'usersList/' + getSignedInUserUid() + '/userPhotoURL'), snap => {
        if (snap) {
            userPhotoContainer.style.background = `url(${snap.val()})`;
            userPhotoContainer.style.backgroundSize = '128px';
        } else {
            userPhotoContainer.style.background = `url("images/userImages/userImageMan.jpg")`
        }
    })

}