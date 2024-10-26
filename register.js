// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPItqOyLf6D3RqZbbppV8yvvVjb7XKRwk",
  authDomain: "proplecoin.firebaseapp.com",
  projectId: "proplecoin",
  storageBucket: "proplecoin.appspot.com",
  messagingSenderId: "975447426127",
  appId: "1:975447426127:web:1ecb3dd40c58f6c7aad63a",
  measurementId: "G-5TS5ED159S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const authForm = document.getElementById('authForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const authFormContainer = document.getElementById('authFormContainer');
  const userIcon = document.getElementById('userIconContainer');
  const closeAuthForm = document.getElementById('closeAuthForm');
  const signInButton = document.getElementById('signInButton');
  const signUpButton = document.getElementById('signUpButton');

  // Function to display error messages
  function showMessage(message, isError = false) {
    console.log(isError ? "Error:" : "Message:", message);
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.classList.add(isError ? 'error-message' : 'success-message');
    authForm.appendChild(messageElement);

    // Remove the error message after 5 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }

  // Show auth form when user icon is clicked
  userIcon.addEventListener('click', () => {
    console.log('User icon clicked');
    authFormContainer.classList.remove('hidden');
  });

  // Close auth form when close button is clicked
  closeAuthForm.addEventListener('click', () => {
    authFormContainer.classList.add('hidden');
  });

  // Handle sign-in button click
  signInButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = usernameInput.value;
    const password = passwordInput.value;

    try {
      // Try to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
      showMessage("Sign in successful!");
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } catch (error) {
      console.error("Sign-in error:", error.code, error.message);
      showMessage(`Sign-in error: ${error.message}`, true);
    }
  });

  // Handle sign-up button click
  signUpButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = usernameInput.value;
    const password = passwordInput.value;

    try {
      // Try to create a new account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("New user created:", userCredential.user);
      showMessage("Sign up successful!");
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } catch (error) {
      console.error("Sign-up error:", error.code, error.message);
      showMessage(`Sign-up error: ${error.message}`, true);
    }
  });

  // Listen for auth state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      console.log("User is signed in:", user);
      // Only redirect if we're not already on the dashboard
      if (!window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'dashboard.html';
      }
    } else {
      // User is signed out
      console.log("User is signed out");
      // Only redirect if we're on the dashboard
      if (window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
      }
    }
  });
});

// You can export the app, analytics, and auth if you need to use them in other files
export { app, auth };
