// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {getDatabase, set, push, ref} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";


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
const db = getDatabase();

const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const firstName = document.getElementById('firstNameInput');
const lastName = document.getElementById('lastNameInput');

function openErrorFirstName() {
    const firstNameDiv = document.getElementById("firstNameDiv");
    firstName.style.borderColor = 'red';
    let errorFirstNameSpan = document.createElement('span');
    errorFirstNameSpan.id = 'firstNameError';
    errorFirstNameSpan.innerText = 'Enter First Name';
    errorFirstNameSpan.style.fontSize = '14px'
    errorFirstNameSpan.style.color = 'red';
    errorFirstNameSpan.classList.add('spanErrorPassword');
    let firstNameError = document.getElementById('firstNameError');
    if (!firstNameError) {
        firstNameDiv.appendChild(errorFirstNameSpan);
    }
    if (errorFirstNameSpan) {
        firstName.addEventListener('click', () => {
            errorFirstNameSpan.remove();
            firstName.style.borderColor = '#ced4da';
        })
    }
}

function openErrorLastName() {
    const lastNameDiv = document.getElementById("lastNameDiv");
    lastName.style.borderColor = 'red';
    let errorLastNameSpan = document.createElement('span');
    errorLastNameSpan.id = 'lastNameError';
    errorLastNameSpan.innerText = 'Enter Last Name';
    errorLastNameSpan.style.fontSize = '14px'
    errorLastNameSpan.style.color = 'red';
    lastNameDiv.classList.add('lastNameError');
    let lastNameError = document.getElementById('lastNameError');
    if (!lastNameError) {
        lastNameDiv.appendChild(errorLastNameSpan);
    }
    if (errorLastNameSpan) {
        lastName.addEventListener('click', () => {
            lastNameError.remove();
            lastName.style.borderColor = '#ced4da';
        })
    }
}

function openErrorEmail(arg) {
    const emailDiv = document.getElementById("emailDiv");
    const emailInputArea = document.getElementById('email');
    emailInputArea.style.borderColor = 'red';
    let errorEmailSpan = document.createElement('span');
    errorEmailSpan.id = 'emailError';
    if (arg && arg === 'inUse') {
        errorEmailSpan.innerText = `This email '${emailInputArea.value}' already registered`;
        emailInputArea.value = '';
        emailInputArea.addEventListener('click', () => {
            let emailError = document.getElementById('emailError');
            emailError.remove();
            emailInputArea.style.borderColor = '#ced4da';
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
        emailInputArea.addEventListener('click', () => {
            errorEmailSpan.remove();
            emailInputArea.style.borderColor = '#ced4da';
        })
    }
}

function openErrorPassword() {
    const passwordDiv = document.getElementById("passwordDiv");
    const passwordInputArea = document.getElementById('password');
    passwordInputArea.style.borderColor = 'red';
    let errorPasswordSpan = document.createElement('span');
    errorPasswordSpan.id = 'passwordError';
    errorPasswordSpan.innerText = 'Invalid or empty Password';
    errorPasswordSpan.style.fontSize = '14px'
    errorPasswordSpan.style.color = 'red';
    errorPasswordSpan.classList.add('spanErrorPassword');
    let passwordError = document.getElementById('passwordError');
    if (!passwordError) {
        passwordDiv.appendChild(errorPasswordSpan);
    }
    if (errorPasswordSpan) {
        passwordInputArea.addEventListener('click', () => {
            errorPasswordSpan.remove();
            passwordInputArea.style.borderColor = '#ced4da';
        })
    }
}

function openErrorConfirmPassword(arg) {
    const confirmPasswordDiv = document.getElementById("confirmPasswordDiv");
    const confirmPasswordInputArea = document.getElementById('confirmPassword');
    confirmPasswordInputArea.style.borderColor = 'red';
    let errorConfirmPasswordSpan = document.createElement('span');
    errorConfirmPasswordSpan.id = 'confirmPasswordError';
    if (arg === 'passNotMatch') {
        errorConfirmPasswordSpan.innerText = 'Passwords not match';
    } else {
        errorConfirmPasswordSpan.innerText = 'Invalid or empty Password';
    }
    errorConfirmPasswordSpan.style.fontSize = '14px'
    errorConfirmPasswordSpan.style.color = 'red';
    errorConfirmPasswordSpan.classList.add('spanErrorPassword');
    let confirmPasswordError = document.getElementById('confirmPasswordError');
    if (!confirmPasswordError) {
        confirmPasswordDiv.appendChild(errorConfirmPasswordSpan);
    }
    if (errorConfirmPasswordSpan) {
        confirmPasswordInputArea.addEventListener('click', () => {
            errorConfirmPasswordSpan.remove();
            confirmPasswordInputArea.style.borderColor = '#ced4da';
        })
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
    if (!confirmPassword.value || confirmPassword.value.length < 8) {
        openErrorConfirmPassword();
        b = false
    }
    if (password.value !== confirmPassword.value) {
        openErrorConfirmPassword('passNotMatch');
        b = false
    }
    if (!firstName.value) {
        openErrorFirstName();
        b = false
    }
    if (!lastName.value) {
        openErrorLastName();
        b = false
    }
    return b
}

let signUp = evt => {
    evt.preventDefault();
    checkIfError();
    if (checkIfError() === true) {
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((credentials) => {
                push(ref(db, 'usersList/' + credentials.user.uid), {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    uId: credentials.user.uid,
                }).then(() => {
                    window.location.href = 'index.html';
                })
            }).catch(err => {
            const error = err.code;
            switch (error) {
                case 'auth/email-already-in-use' : {
                    openErrorEmail('inUse');
                }
            }
        })
    }
};

form.addEventListener('submit', signUp)




