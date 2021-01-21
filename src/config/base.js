import firebase from 'firebase'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyAooXI-FHvzNuT32FP7csswTJtEGimtEYc",
    authDomain: "dev-challenge-workspace.firebaseapp.com",
    projectId: "dev-challenge-workspace",
    storageBucket: "dev-challenge-workspace.appspot.com",
    messagingSenderId: "629399812067",
    appId: "1:629399812067:web:745f828551d699dd0892d6",
    measurementId: "G-TBZF12FMS6"
};

export const app = firebase.initializeApp(firebaseConfig);
export const firebaseStorage = app.storage();