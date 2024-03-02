// // Import the functions you need from the SDKs you need
// import {initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// import {
//     getAuth,
//     signOut,
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword
// } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// import {
//     getFirestore,
//     collection,
//     addDoc,
//     getDocs,
//     setDoc,
//     doc
// } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
//
// function writeMessage() {
// }
//
//
// let sendButton = document.getElementById('sendButton');
// let messageInput = document.getElementById('messageInput');
// let messArr = [];
// let receivedMessagesArr = [];
// let lastReceivedMessageArr = [];
//
// let form = document.getElementById('form');
//
// function createMessageElement(data) {
//     return `
// <br>
//                     <div id="sentMessage" style="display: flex; align-items: flex-end; width: auto; min-height: 60px">
//                     <div style="min-width: 260px; height: 100%; background-color: #4165f3; border-radius: 20px">
//                         <span>
//                                 <div style="padding: 3px; margin: 11px; max-width: 260px; color: white; word-wrap: break-word">${data}</div>
//                         </span>
//                     </div>
//                     <div style="display: flex; justify-content: center; align-items: center; width: 60px; height: 100%">
//                         <div style="width: 45px; height: 45px; background-image: url(images/userImages/userImageMan.jpg); background-size: 100%; border: 0 solid; border-radius: 50px">
//                         </div>
//                     </div>
//                 </div>
// `
// }
//
// form.addEventListener('submit', (e) => {
//     if (messageInput.value.replace(/\s+/g, '') !== '') {
//         messArr.unshift(messageInput.value);
//         sendMessageToServer();
//         getLastMessage();
//         messageInput.value = '';
//     } else {
//         messageInput.value = '';
//     }
//     e.preventDefault()
// });
//
// function scrollBottom() {
//     let elem = document.getElementById('messagesArea');
//     elem.scrollTop = elem.scrollHeight;
// }
//
//
//
// signOut(app).then((res) => {
//     console.log(res)
//
// })
//
// console.log(sout)
//
//
//
// // function onSend() {
// //     let messagesArea = document.getElementById('messagesArea');
// //     messagesArea.scroll();
// //     let message = document.createElement('div');
// //
// //         message.innerHTML = createMessageElement(receivedMessagesArr);
// //         messagesArea.appendChild(message);
// //     scrollBottom()
// // }
//
//
// let el = `
//     <div class="newDiv" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%">
//         <span>Invalid email or password</span>
//     </div>
// `
//
// function openErrorEmail() {
//     const emailDiv = document.getElementById("emailDiv");
//     const emailInputArea = document.getElementById('emailInputArea');
//     emailInputArea.style.borderColor = 'red';
//     let errorEmailSpan = document.createElement('span');
//     errorEmailSpan.innerText = 'Invalid Email';
//     errorEmailSpan.style.fontSize = '14px'
//     errorEmailSpan.style.color = 'red';
//     errorEmailSpan.classList.add('spanErrorEmail')
//     emailDiv.appendChild(errorEmailSpan);
// }
//
// function openErrorPassword() {
//     const passwordDiv = document.getElementById("passwordDiv");
//     const passwordInputArea = document.getElementById('passwordInputArea');
//     passwordInputArea.style.borderColor = 'red';
//     let errorPasswordSpan = document.createElement('span');
//     errorPasswordSpan.innerText = 'Invalid Password';
//     errorPasswordSpan.style.fontSize = '14px'
//     errorPasswordSpan.style.color = 'red';
//     errorPasswordSpan.classList.add('spanErrorPassword')
//     passwordDiv.appendChild(errorPasswordSpan);
// }
//
// function checkIfBtnClose() {
//     let btn = document.querySelector('.button-close');
//     let modal = document.querySelector('.modal');
//     if (btn) {
//         btn.addEventListener('click', () => {
//             removeModal()
//         });
//         modal.addEventListener('click', (event) => {
//             if (event.target.className === 'modal') {
//                 removeModal()
//             }
//         })
//     }
//     return true
// }
//
//
// function renderModal(element) {
//     // create the background modal div
//     const modal = document.createElement('div');
//     modal.classList.add('modal');
//     // create the inner modal div with appended argument
//     const child = document.createElement('div');
//     child.classList.add('child');
//     child.innerHTML = element;
//     // render the button with child on DOM
//     const divForCloseButton = document.createElement('div');
//     divForCloseButton.classList.add('divForCloseButton');
//     const buttonClose = document.createElement('button');
//     buttonClose.classList.add('button-close');
//     child.appendChild(buttonClose);
//     divForCloseButton.appendChild(buttonClose);
//     child.appendChild(divForCloseButton);
//     // render the modal with child on DOM
//     modal.appendChild(child);
//     document.body.appendChild(modal);
//     checkIfBtnClose()
//
// }
//
// function removeModal() {
//     // find the modal and remove if it exists
//     const modal = document.querySelector('.modal')
//     if (modal) {
//         modal.remove()
//     }
// }
//
// // let modal = document.getElementById('modal')
// // function openModal(modal) {
// //     modal.addEventListener('click', modal.style.display = 'block')
// // }
// // function closeModal(modal) {
// //     modal.addEventListener('click', modal.style.display = 'none')
// // }
//
//
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyAcjkoMZcttxOBHOFqITeg0ajyFJhCx9OY",
//     authDomain: "chatapp-5d0f0.firebaseapp.com",
//     projectId: "chatapp-5d0f0",
//     storageBucket: "chatapp-5d0f0.appspot.com",
//     messagingSenderId: "361463095812",
//     appId: "1:361463095812:web:d78f96e5fc72195f828b51"
// };
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth();
//
// const db = getFirestore(app);
//
// function sendMessageToServer() {
//     const str = Date.now().toString()
//     try {
//         const writeMessage = setDoc(doc(db, "messages", str), {
//             message: messArr[0],
//             timeStamp: str
//         });
//         writeMessage.then((result) => {
//         })
//     } catch (e) {
//         console.error("Error adding document: ", e);
//     }
// }
//
// document.addEventListener('DOMContentLoaded', () => getAllMessagesFromServer());
//
// function getAllMessagesFromServer() {
//     const dataFromServer = getDocs(collection(db, 'messages')).then((message) => {
//         message.forEach((doc) => {
//             const messagesArea = document.getElementById('messagesArea');
//             const message = document.createElement('div');
//             message.innerHTML = createMessageElement(doc._document.data.value.mapValue.fields.message.stringValue);
//             messagesArea.appendChild(message);
//             scrollBottom()
//         })
//     })
// }
//
// function getLastMessage() {
//     getDocs(collection(db, 'messages')).then((mess) => {
//         const lastMessage = mess.docs.slice(-1);
//         const messagesArea = document.getElementById('messagesArea');
//         const message = document.createElement('div');
//         message.innerHTML = createMessageElement(lastMessage[0]._document.data.value.mapValue.fields.message.stringValue);
//         messagesArea.appendChild(message);
//         scrollBottom()
//     })
//
// }
//
// let signUp = document.getElementById('signUp');
//
// if (signUp) {
//     signUp.addEventListener('click', (e) => {
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;
//         if (!email || !email.includes('@')) {
//             alert('Invalid or empty email')
//         } else if (!password) {
//             alert('Your password area is empty')
//         } else {
//             createUserWithEmailAndPassword(auth, email, password)
//                 .then(async (userCredential) => {
//                     const user = userCredential.user;
//                     // window.location.href = "home.html";
//                     const userData = await userCredential;
//
//                     async function populateUserInfo(userData) {
//                         const userInfoContainer = await document.getElementById("user-info");
//                         userInfoContainer.innerHTML = `
//             <h2>Welcome, ${userData.userName} ${userData.lastName}!</h2>
//             <p>Email: ${userData.email}</p>
//             <p>Age: ${userData.age}</p>
//             <!-- Add more user data here -->
//         `;
//                     }
//
//                     // Call the function to populate user information
//                     populateUserInfo(userData);
//
//                     console.log(user)
//                 }).catch(err => {
//                 const error = err.code;
//                 console.log(error)
//                 const emailSpanArea = document.getElementById('emailInputArea').value;
//                 const passwordSpanArea = document.getElementById('passwordInputArea').value;
//                 switch (error) {
//                     case 'auth/missing-email' : {
//                         console.log('Invalid or empty email');
//                         alert('asd')
//                     }
//                         break;
//                     case 'auth/missing-password' :
//                         console.log('Your password area is empty');
//                         break;
//                 }
//                 console.log(err)
//             })
//         }
//     })
// }
//
// let signIn = document.getElementById('signIn');
//
// if (signIn) {
//     signIn.addEventListener('click', (e) => {
//         const email = document.getElementById('emailInputArea').value;
//         const password = document.getElementById('passwordInputArea').value;
//         let errorEmailSpan = document.querySelector('#emailDiv').querySelectorAll('span');
//         let errorPasswordSpan = document.getElementById('emailDiv').querySelectorAll('span');
//
//
//         if (email.length === 0 && errorEmailSpan.length === 0) {
//             openErrorEmail();
//             if (errorEmailSpan) {
//                 errorEmailSpan.remove()
//             }
//         }
//         if (password.length === 0 && errorPasswordSpan.length === 0) {
//             openErrorPassword();
//         }
//
//         signInWithEmailAndPassword(auth, email, password)
//             .then(async (userCredential) => {
//                 const user = userCredential.user;
//                 const userData = await userCredential.user;
//                 location.href = 'home.html';
//             })
//             .catch((err) => {
//                 const error = err.code;
//             })
//     })
// }
