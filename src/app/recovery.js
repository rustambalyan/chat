import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, sendPasswordResetEmail} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

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

// Инициализация приложения Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Получение объекта аутентификации
const auth = getAuth(firebaseApp);

// Адрес электронной почты пользователя, для которого нужно отправить email для сброса пароля
const form = document.getElementById('form');

form.addEventListener('submit', sendResetEmail)

// Отправка email для сброса пароля
function sendResetEmail(evt) {
    evt.preventDefault();
    const email = document.getElementById('email');
    console.log(email);
    sendPasswordResetEmail(auth, email.value)
        .then(() => {
            // Email для сброса пароля был успешно отправлен
            console.log('Password reset email has been sent to:', email);
        })
        .catch((error) => {
            // Возникла ошибка при отправке email для сброса пароля
            console.error('Error sending password reset email:', error);
        });



}
