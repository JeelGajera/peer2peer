// const apiKey = window.env.firebaseApi;
// const authDomain = window.env.firebaseAuthDomain;
// const projectId = window.env.firebaseProjectId;
// const storageBucket = window.env.firebaseStorageBucket;
// const messagingSenderId = window.env.firebaseMessagingSenderId;
// const appId = window.env.firebaseAppId;
// const measurementId = window.env.firebaseMeasurementId;

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD05Xqrf7T-hqGsYRSOATU4DFBOi2e9y-k",
    authDomain: "peer2peer-690f0.firebaseapp.com",
    projectId: "peer2peer-690f0",
    storageBucket: "peer2peer-690f0.appspot.com",
    messagingSenderId: "774552076956",
    appId: "1:774552076956:web:bb13b039b1ae12c57da359",
    measurementId: "G-SKJDG6NK9N"
    // apiKey: apiKey,
    // authDomain: authDomain,
    // projectId: projectId,
    // storageBucket: storageBucket,
    // messagingSenderId: messagingSenderId,
    // appId: appId,
    // measurementId: measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);

login.addEventListener('click', (e) => {
    e.preventDefault();

    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            createUser({
                name: user.displayName,
                profileImg: user.photoURL,
                email: user.email
            });
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, email, credential);
        });
});