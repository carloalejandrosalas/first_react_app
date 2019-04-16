import React from 'react';
import ReactDOM from 'react-dom';
import firebase from "firebase";

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
    apiKey: "AIzaSyBS2ynm27ZxvizMkaLx2Sge6T1HNlVPkj4",
    authDomain: "react-app-4724f.firebaseapp.com",
    databaseURL: "https://react-app-4724f.firebaseio.com",
    projectId: "react-app-4724f",
    storageBucket: "react-app-4724f.appspot.com",
    messagingSenderId: "717652894419"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
