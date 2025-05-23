// Import the functions you need from the SDKs you need
import {initializeApp, onLog} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {getDatabase, get, ref, child} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import {
    getAuth,
    sendPasswordResetEmail,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const auth = getAuth(app);
const dbRt = getDatabase();
const dbRef = ref(dbRt)


const email = document.getElementById('email');
const password = document.getElementById('password');
const form = document.getElementById('form');

function openErrorEmail(arg) {
    const emailDiv = document.getElementById("emailDiv");
    email.style.borderColor = "red";
    const errorEmailSpan = document.createElement('span');
    errorEmailSpan.id = 'emailError';
    if (arg && arg === 'user-not-found') {
        errorEmailSpan.innerText = `User '${email.value}' not found`;
        email.value = '';
        email.addEventListener('click', () => {
            let emailError = document.getElementById('emailError');
            emailError.remove();
            email.style.borderColor = '#ced4da';
        })
    } else {
        errorEmailSpan.innerText = 'Invalid or empty email';
    }
    errorEmailSpan.style.fontSize = '14px'
    errorEmailSpan.style.color = 'red';
    errorEmailSpan.classList.add('spanErrorEmail');
    let emailError = document.getElementById('emailError');
    if (!emailError) {
        emailDiv.appendChild(errorEmailSpan);
    }
    if (errorEmailSpan) {
        email.addEventListener('click', () => {
            errorEmailSpan.remove();
            email.style.borderColor = '#ced4da';
        })
    }

}

function openErrorPassword() {
    const passwordDiv = document.getElementById("passwordDiv");
    password.style.borderColor = 'red';
    let errorPasswordSpan = document.createElement('span');
    errorPasswordSpan.id = 'passwordError';
    let passwordError = document.getElementById('passwordError')
    if (!passwordError) {
        password.addEventListener("click", () => {
            password.style.borderColor = '#ced4da';
            errorPasswordSpan.remove()
        })
    }
    errorPasswordSpan.innerText = 'Invalid or empty password';
    errorPasswordSpan.style.fontSize = '14px'
    errorPasswordSpan.style.color = 'red';
    errorPasswordSpan.classList.add('spanErrorPassword');
    password.addEventListener('click', () => {

    })
    if (!passwordError) {
        passwordDiv.appendChild(errorPasswordSpan);
    }
}

function checkIfError() {
    let b = true;
    if (!email.value || !email.value.includes('@')) {
        openErrorEmail();
        b = false
    }
    if (!password.value || password.value.length < 8) {
        openErrorPassword();
        b = false
    }
    return b
}


let signIn = evt => {
    evt.preventDefault();
    checkIfError();
    if (checkIfError() === true) {
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((credentials) => {
                get(child(dbRef, 'usersList/' + credentials.user.uid)).then((snapshot) => {
                    if (snapshot.exists()) {
                        //
                        // let ents = Object.entries(snapshot.val());
                        // if(ents.length >= 2) {
                        //     let key1 = ents[0];
                        //     let key2 = ents[1];
                        //     let firstName = key1[1].firstName;
                        //     let lastName = key1[1].lastName;
                        // }
                            sessionStorage.setItem('user-info', JSON.stringify({
                                firstName: snapshot.val().firstName,
                                lastName: snapshot.val().lastName,
                            }));


                        sessionStorage.setItem('user-creds', JSON.stringify(credentials.user));
                        window.location.href = 'home.html'
                    }
                }).catch((err) => {
                    console.log(err)
                })
            })
            .catch((err) => {
                switch (err.code) {
                    case 'auth/invalid-credential': {
                        openErrorEmail('user-not-found')
                    }
                }
            })
    }
}

form.addEventListener('submit', signIn);