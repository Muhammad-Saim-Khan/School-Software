import { initializeApp } from "firebase/app";

// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyALSYmfB-6-ZLycZyZg98Uxx2sGqfYRpYw",
  authDomain: "reactapp-e63ef.firebaseapp.com",
  databaseURL: "https://reactapp-e63ef-default-rtdb.firebaseio.com",
  projectId: "reactapp-e63ef",
  storageBucket: "reactapp-e63ef.appspot.com",
  messagingSenderId: "281900407941",
  appId: "1:281900407941:web:49730471e46db3f9475dec",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);

export default app;
