// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAR0UfJ1pSs1vZKID-IrI8351Rc-_EAo4A",
    authDomain: "my-scheduler-app-84473.firebaseapp.com",
    projectId: "my-scheduler-app-84473",
    storageBucket: "my-scheduler-app-84473.appspot.com",
    messagingSenderId: "586165614357",
    appId: "1:586165614357:web:80b98a0dbe170710159b1c"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
