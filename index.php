<head>
    <!-- linking css file with html file -->
    <link rel="stylesheet" href="main.css">
</head>

<?php //require_once("header.php"); ?>

<body>
  <div class="center-box">
    <div class="container text-center">
      <h1> Here is the Form to Take and Fill Out! </h1>
      <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSe750TrU5eKALR8WIZxF_4sKmpKwEnd77-1fNHCvCoMbkCj-Q/viewform?embedded=true" width="640" height="375" frameborder="0" marginheight="0" marginwidth="0" class="form-container">Loading…</iframe>
      <h2> Thank you for taking the time to fill out the form! </h2>
    </div>
  </div>



  <script type="module">
  //NEED to keep this tag/section in so we can make firebase calls, also should stay at the bottom of body
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBvWLtRYPBN0qKj_K30p1sY3vOS2hFAzQQ",
    authDomain: "sin-reed-edu.firebaseapp.com",
    databaseURL: "https://sin-reed-edu.firebaseio.com",
    projectId: "sin-reed-edu",
    storageBucket: "sin-reed-edu.appspot.com",
    messagingSenderId: "922484667339",
    appId: "1:922484667339:web:de17b706cc0f4340a47c4e"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  </script>
</body>
