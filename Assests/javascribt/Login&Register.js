import { usersData } from "./accounts.js";

// Initialize `localStorage` with `usersData` if not already set
const signUpObject =
  JSON.parse(localStorage.getItem("signUpData")) ?? usersData;

if (!localStorage.getItem("signUpData")) {
  localStorage.setItem("signUpData", JSON.stringify(signUpObject));
}

// Function to handle form submission
document.addEventListener("DOMContentLoaded", function () {
  const signUpForm = document.getElementById("signupForm");

  if (signUpForm) {
    signUpForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent page reload on form submit

      // Get form data
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const password = document.getElementById("password").value.trim();

      // Validate input fields
      if (!username || !email || !phone || !password) {
        alert("Please fill in all fields.");
        return;
      }

      // Function to check if a username or email exists anywhere in all localStorage objects
      function checkDuplicateInLocalStorage(value, type) {
        let found = false;

        // Loop through all localStorage keys
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const data = JSON.parse(localStorage.getItem(key));

          // Ensure the data is an object and check for username/email
          if (data && typeof data === "object") {
            // Check for the username or email in any object stored in localStorage
            if (
              type === "username" &&
              Object.values(data).some((user) => user.username === value)
            ) {
              found = true;
              break;
            }
            if (
              type === "email" &&
              Object.values(data).some((user) => user.email === value)
            ) {
              found = true;
              break;
            }
          }
        }

        return found;
      }

      // Check if the username or email already exists in any object in localStorage
      const isUsernameTaken = checkDuplicateInLocalStorage(
        username,
        "username"
      );
      const isEmailTaken = checkDuplicateInLocalStorage(email, "email");

      if (isUsernameTaken) {
        alert("This username has already been taken.");
        return;
      }

      if (isEmailTaken) {
        alert("This email is already registered.");
        return;
      }

      // Create a new user object with default role as 'customer'
      const newUser = {
        username,
        email,
        phone,
        password,
        role: "customer",
        address: "",
        imgsrc: "",
        cart: [],
        wishlist: [],
        orders_history: [],
        inbox: [],
      };

      // Add the new user to the customers object
      const currentData = JSON.parse(localStorage.getItem("signUpData")) ?? {
        customers: {},
      };
      currentData.customers = currentData.customers || {};
      currentData.customers[email] = newUser;

      // Save the updated structure back to `localStorage`
      localStorage.setItem("signUpData", JSON.stringify(currentData));

      alert("Account created successfully!");

      // Reset form fields
      signUpForm.reset();

      // Log the updated data to confirm
      console.log(currentData);
    });
  }
});

let typingTimer;
const doneTypingInterval = 500;

// Email Validation
const emailField = document.getElementById("email");
const emailError = document.getElementById("emailError");
function validateEmail() {
  const emailValue = emailField.value.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+(?<!\.)@gmail\.com$/;
  const invalidCharsRegex = /[!#$%^&*(),?":{}|<>]$/;

  if (!emailRegex.test(emailValue)) {
    emailError.innerHTML = "Invalid Email (e.g., user@gmail.com)";
    emailField.style.borderBottomColor = "red";
    emailError.style.display = "block";
  } else if (invalidCharsRegex.test(emailValue.split("@")[0])) {
    emailError.innerHTML =
      "Email cannot end with special characters before '@gmail.com'";
    emailField.style.borderBottomColor = "red";
    emailError.style.display = "block";
  } else {
    emailError.style.display = "none";
    emailField.style.borderBottomColor = "green";
  }
}
emailField.addEventListener("input", function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(validateEmail, doneTypingInterval);
});

// Phone Validation
const phoneField = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");
function validatePhone() {
  const phoneValue = phoneField.value;
  const phoneRegex = /^(011|012|010|015)\d{8}$/;

  if (!phoneValue.match(phoneRegex)) {
    phoneError.innerHTML = "Invalid Phone Number";
    phoneField.style.borderBottomColor = "red";
    phoneError.style.display = "block";
  } else {
    phoneError.style.display = "none";
    phoneField.style.borderBottomColor = "green";
  }
}
phoneField.addEventListener("input", function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(validatePhone, doneTypingInterval);
});

// Password Validation
const passwordField = document.getElementById("password");
const confirmPasswordField = document.getElementById("confirmPassword");
const passwordLengthError = document.getElementById("passwordLengthError");
const passwordStrengthError = document.getElementById("passwordStrengthError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
function validatePassword() {
  const passwordValue = passwordField.value;
  const passwordLengthRegex = /.{8,}/;
  const passwordStrengthRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  if (!passwordValue.match(passwordLengthRegex)) {
    passwordLengthError.style.display = "block";
    passwordStrengthError.style.display = "none";
    passwordField.style.borderBottomColor = "red";
  } else if (!passwordValue.match(passwordStrengthRegex)) {
    passwordStrengthError.style.display = "block";
    passwordLengthError.style.display = "none";
    passwordField.style.borderBottomColor = "red";
  } else {
    passwordLengthError.style.display = "none";
    passwordStrengthError.style.display = "none";
    passwordField.style.borderBottomColor = "green";
  }
}
passwordField.addEventListener("input", function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(validatePassword, doneTypingInterval);
});

function validateConfirmPassword() {
  const confirmPasswordValue = confirmPasswordField.value;

  if (confirmPasswordValue !== passwordField.value) {
    confirmPasswordError.style.display = "block";
    confirmPasswordField.style.borderBottomColor = "red";
  } else {
    confirmPasswordError.style.display = "none";
    confirmPasswordField.style.borderBottomColor = "green";
  }
}
confirmPasswordField.addEventListener("input", function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(validateConfirmPassword, doneTypingInterval);
});

// Username Validation
const usernameField = document.getElementById("username");
const usernameError = document.getElementById("usernameError");
function validateUsername() {
  const usernameValue = usernameField.value.trim();
  const usernameRegex = /^[a-zA-Z\s_-]+$/; // Updated regex to allow space, dash, and underscore
  const invalidStartEndMiddleRegex = /^(?![^\w\s_-]|.*[^\w\s_-]$).*$/; // Disallow special characters at start, middle, or end

  if (!usernameValue.match(usernameRegex)) {
    usernameError.innerHTML =
      "Username can only contain letters, spaces, underscores, or dashes.";
    usernameField.style.borderBottomColor = "red";
    usernameError.style.display = "block";
  } else if (!invalidStartEndMiddleRegex.test(usernameValue)) {
    usernameError.innerHTML =
      "Special characters are not allowed at the start, middle, or end.";
    usernameField.style.borderBottomColor = "red";
    usernameError.style.display = "block";
  } else if (localStorage.getItem(usernameValue)) {
    usernameError.innerHTML = "This Username Has Been Taken Before";
    usernameField.style.borderBottomColor = "red";
    usernameError.style.display = "block";
  } else {
    usernameError.style.display = "none";
    usernameField.style.borderBottomColor = "green";
  }
}

usernameField.addEventListener("input", function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(validateUsername, doneTypingInterval);
});

// Handle Auto Email Generation from Username
usernameField.addEventListener("input", function () {
  const username = usernameField.value.trim();

  // Remove spaces, dashes, and underscores from the username before generating the email
  const sanitizedUsername = username.replace(/[ \-_]/g, "").toLowerCase();

  // Create the email by appending "@gmail.com"
  const email = sanitizedUsername + "@gmail.com";

  // Update the email field with the generated email
  if (sanitizedUsername) {
    emailField.value = email;
  } else {
    emailField.value = "";
  }
});

// Hash Password
function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}

// Sign Up Button Event
const signUpButton = document.querySelector(".sign-up-container button");

signUpButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default behavior (page reload)

  // Collect values
  const username = usernameField.value.trim();
  const email = emailField.value.trim();
  const phone = phoneField.value.trim();
  const password = passwordField.value.trim();
  const confirmPassword = confirmPasswordField.value.trim();

  if (!username || !email || !phone || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return; // Stop further execution
  }

  // Retrieve the current signUpObject from localStorage
  const signUpObject = JSON.parse(localStorage.getItem("signUpData")) ?? {
    customers: [],
  };

  // Check if username or email already exists in the customers object
  const isUsernameTaken = Object.values(signUpObject.customers).some(
    (user) => user.username === username
  );
  const isEmailTaken = Object.values(signUpObject.customers).some(
    (user) => user.email === email
  );

  if (isUsernameTaken) {
    usernameError.innerHTML = "This Username Has Been Taken Before";
    usernameError.style.display = "block";
    return;
  }

  if (isEmailTaken) {
    emailError.innerHTML = "This Email Is Already Registered";
    emailError.style.display = "block";
    return;
  }

  // Hash password
  const hashedPassword = hashPassword(password);

  // Create a new user object
  const newUser = {
    username,
    email,
    phone,
    password: hashedPassword,
    role: "customer",
    address: "",
    imgsrc: "",
    cart: [],
    wishlist: [],
  };

  // Add the new user to the customers object
  signUpObject.customers[email] = newUser;

  // Save the updated object back to localStorage
  localStorage.setItem("signUpData", JSON.stringify(signUpObject));

  alert("Account created successfully!");

  // Reset form fields
  usernameField.value = "";
  emailField.value = "";
  phoneField.value = "";
  passwordField.value = "";
  confirmPasswordField.value = "";
});
const signInButton = document.querySelector(".sign-in-container button");
const signInError = document.getElementById("signInError");
const signinEmailField = document.querySelector(
  '.sign-in-container input[type="email"]'
);
const signinPasswordField = document.querySelector(
  '.sign-in-container input[type="password"]'
);

signInButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default behavior (page reload)

  const email = signinEmailField.value.trim();
  const password = signinPasswordField.value.trim();

  signInError.style.display = "none";

  // Validation checks
  if (!email || !password) {
    signInError.innerHTML = "Please fill in both email and password.";
    signInError.style.display = "block";
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._-]{2,}@gmail\.com$/;
  if (!emailRegex.test(email)) {
    signInError.innerHTML =
      "Please enter a valid email address with at least 2 characters before '@gmail.com'.";
    signInError.style.display = "block";
    return;
  }

  // Fetch data from localStorage
  const signUpData = JSON.parse(localStorage.getItem("signUpData")) || {};
  const { admin, customers, sellers } = signUpData;

  let foundUser = null;
  let role = "";

  // Check for user in each role
  if (admin && admin[email]) {
    foundUser = admin[email];
    role = "admin";
  } else if (customers && customers[email]) {
    foundUser = customers[email];
    role = "customer";
  } else if (sellers && sellers[email]) {
    foundUser = sellers[email];
    role = "seller";
  }

  // User not found
  if (!foundUser) {
    signInError.innerHTML =
      "This email is not registered. Please sign up first.";
    signInError.style.display = "block";
    return;
  }

  // Compare entered password with the stored password
  if (foundUser.pass !== password) {
    signInError.innerHTML = "Email or Password is incorrect. Please try again.";
    signInError.style.display = "block";
    return;
  }

  // Store session data with loginObject using sessionStorage
  const loginObject = {
    session: {
      email: email,
      password: password,
    },
  };
  sessionStorage.setItem("currentSession", JSON.stringify(loginObject));

  // Redirect based on role
  if (role === "admin") {
    window.location.href = "admindashboard.html";
  } else if (role === "customer") {
    window.location.href = "homepage.html";
  } else if (role === "seller") {
    window.location.href = "ProductsSearch.html";
  } else {
    signInError.innerHTML = "User role not recognized.";
    signInError.style.display = "block";
  }

  // Clear form inputs
  signinEmailField.value = "";
  signinPasswordField.value = "";
});

// Overlay Button for Switching Forms
const container = document.getElementById("container");
const overlayBtn = document.getElementById("overlayBtn");
overlayBtn.addEventListener("click", () => {
  container.classList.toggle("right-panel-active");
  overlayBtn.classList.remove("btnScaled");
  window.requestAnimationFrame(() => {
    overlayBtn.classList.add("btnScaled");
  });
});
