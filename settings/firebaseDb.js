"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { initializeApp } = require("firebase/app");
const { getDatabase, set, ref, update } = require("firebase/database");
const { getAuth } = require("firebase/auth");

const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-D7arV4svUwuAPZvZBHnvfbVaf3fH5LM",
  authDomain: "salus-7dbd9.firebaseapp.com",
  databaseURL: "https://salus-7dbd9-default-rtdb.firebaseio.com",
  projectId: "salus-7dbd9",
  storageBucket: "salus-7dbd9.appspot.com",
  messagingSenderId: "1051098864834",
  appId: "1:1051098864834:web:1a75a42452df2c4b7a2f5b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

exports.signUp = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const payload = { subject: email };
  const token = jwt.sign(payload, "secretKey");

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const password = userCredential.user.reloadUserInfo.passwordHash;

      set(ref(database, "users/" + user.uid), {
        email: email,
      });
      res.status(200).send({ token: token, user: { email, password } });
    })
    .catch((error) => {
      res.status(400).send({
        message: "Cannot register user",
        error,
      });
    });
};

exports.signIn = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (password) {
    const token = jwt.sign(
      {
        email: email,
      },
      "supersecret",
      {
        expiresIn: 120 * 120,
      }
    );

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const password = userCredential.user.reloadUserInfo.passwordHash;
        const dt = new Date();

        update(ref(database, "users/" + user.uid), {
          email: email,
          last_login: dt,
        });
        res
          .status(200)
          .send({ token: token, user: { email: email, password: password } });
      })
      .catch((error) => {
        res.status(400).send({
          message: "User already exist",
          error,
        });
      });
  }
};
