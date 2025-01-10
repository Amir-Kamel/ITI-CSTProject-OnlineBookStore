document.addEventListener("DOMContentLoaded", function () {
  function loadContent(url, elementId) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById(elementId).innerHTML = data;
        // Ensure the badge is updated after the navigation is loaded
        if (elementId === "mainNavigation") {
          // Call the updateCartBadge function defined in nav.js
          updateCartBadge();
          updateFavoritesBadge();
          setActiveLink();
          updateUserDropdown();
        }
      })
      .catch((error) => console.error("Error loading content:", error));
  }

  // Load navigation and footer
  loadContent("nav.html", "mainNavigation");
  loadContent("footer.html", "footer");
});

// function to get the current username
async function getCurrentUsername() {
  const sessionData = JSON.parse(sessionStorage.getItem("currentSession"));
  if (!sessionData || !sessionData.session || !sessionData.session.email) {
    return "";
  }

  const currentEmail = sessionData.session.email;
  const signUpData = JSON.parse(localStorage.getItem("signUpData"));

  if (!signUpData || !signUpData.customers || !signUpData.customers[currentEmail]) {
    return "";
  }

  return signUpData.customers[currentEmail].username;
}

// function to check if the username already exists
function isUsernameTaken(username) {
  const signUpData = JSON.parse(localStorage.getItem("signUpData"));
  for (const email in signUpData.customers) {
    if (signUpData.customers[email].username === username) {
      return true;
    }
  }
  return false;
}

//  function to check if the email is already taken
function isEmailTaken(email) {
  const signUpData = JSON.parse(localStorage.getItem("signUpData"));
  return signUpData.customers && signUpData.customers[email] !== undefined;
}

// Username validation (allow spaces between letters)
function validateUsername(username) {
  const regex = /^[a-zA-Z\s]{3,15}$/; // Letters and spaces, between 3 and 15 characters
  return regex.test(username);
}
// Gmail email validation (cannot start with special characters or numbers)
function validateEmail(email) {
  const regex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.com$/;
  if (!regex.test(email)) {
    return {
      valid: false,
      message: "Invalid Email (e.g., user@gmail.com)",
    };
  }
  return {
    valid: true,
    message: "Valid email",
  };
}

// Password validation
function validatePassword(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// Function to hash password (using SHA-256)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const hashedBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(password));
  return Array.from(new Uint8Array(hashedBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
// Autofill profile data when the page loads
document.addEventListener("DOMContentLoaded", function () {
  autofillProfileData();

  // Add event listener to the save button
  const saveButton = document.getElementById("save-button");
  if (saveButton) {
    saveButton.addEventListener("click", function () {
      saveChanges();
    });
  }

  // Function to autofill profile data
  function autofillProfileData() {
    const usernameField = document.querySelector('[name="username"]');
    const emailField = document.querySelector('[name="email"]');
    const currentPasswordField = document.querySelector('[name="current-password"]');

    // Check if fields are available in the form
    if (!usernameField || !emailField || !currentPasswordField) {
      console.error("One or more form fields are missing.");
      return;
    }

    // Get the session data
    const sessionData = JSON.parse(sessionStorage.getItem("currentSession"));

    if (!sessionData || !sessionData.session || !sessionData.session.email) {
      console.error("No session data found.");
      return;
    }

    const currentEmail = sessionData.session.email;

    // Get the sign-up data from localStorage
    const signUpData = JSON.parse(localStorage.getItem("signUpData"));

    if (!signUpData || !signUpData.customers || !signUpData.customers[currentEmail]) {
      console.error("User data not found.");
      return;
    }

    const userData = signUpData.customers[currentEmail];

    // Autofill the form with existing data
    usernameField.value = userData.username || "";
    emailField.value = userData.email || "";
    currentPasswordField.value = ""; // Don't autofill the current password
  }

  // Function to save changes when the button is clicked
  async function saveChanges() {
    const username = document.querySelector('[name="username"]').value.trim();
    const email = document.querySelector('[name="email"]').value.trim();
    const currentPassword = document.querySelector('[name="current-password"]').value.trim();
    const newPassword = document.querySelector('[name="new-password"]').value.trim();
    const repeatPassword = document.querySelector('[name="repeat-password"]').value.trim();

    console.log({
      username,
      email,
      currentPassword,
      newPassword,
      repeatPassword,
    });

    // Validate username
    if (!validateUsername(username)) {
      alert("Invalid username. It must only contain letters, and no special characters or numbers.");
      return;
    }

    // Get the current session data
    const sessionData = JSON.parse(sessionStorage.getItem("currentSession"));
    if (!sessionData || !sessionData.session || !sessionData.session.email) {
      console.error("No session data found.");
      return;
    }

    const currentEmail = sessionData.session.email;

    // Check if the username is already taken, but skip if the entered username is the same as the current one
    if (username !== "" && username !== (await getCurrentUsername()) && isUsernameTaken(username)) {
      alert("Username already exists.");
      return;
    }

    // Validate email only if it has changed
    if (email !== currentEmail) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        alert(emailValidation.message);
        return;
      }
      if (isEmailTaken(email)) {
        alert("This email is already taken. Please choose another email.");
        return;
      }
    }

    // Validate passwords
    if (newPassword || repeatPassword) {
      if (!validatePassword(newPassword)) {
        alert("Password must be at least 8 characters long and contain at least one letter, one digit, and one special character.");
        return;
      }
      if (newPassword && newPassword !== repeatPassword) {
        alert("New password and repeat password must match!");
        return;
      }
    }

    // Get sign-up data from localStorage
    const signUpData = JSON.parse(localStorage.getItem("signUpData"));
    if (!signUpData || !signUpData.customers || !signUpData.customers[currentEmail]) {
      console.error("User data not found in localStorage.");
      return;
    }

    const userData = signUpData.customers[currentEmail];

    // Hash the current password entered by the user
    const hashedCurrentPassword = await hashPassword(currentPassword);

    // Compare the entered current password (hashed) with the stored password (hashed)
    if (hashedCurrentPassword !== userData.password) {
      console.error("Incorrect current password.");
      alert("The current password is incorrect!");
      return;
    }

    // Update only the fields that have changed
    let updated = false;

    // Handle fields that might change (username, email, password)
    if (username && username !== userData.username) {
      userData.username = username;
      updated = true;
    }
    if (email && email !== currentEmail && email !== userData.email) {
      userData.email = email; // Update email only if it’s different
      updated = true;
    }
    if (newPassword && newPassword !== userData.password) {
      userData.password = await hashPassword(newPassword); // Hash and store the new password
      updated = true;
    }

    // If there were changes, we need to update the user data and save it back
    if (updated) {
      // If email has changed, we need to check if the new email already exists
      if (email !== currentEmail && isEmailTaken(email)) {
        alert("This email is already taken. Please choose another email.");
        return;
      }

      // If email has changed, we need to move the data to the new email key
      if (email !== currentEmail) {
        signUpData.customers[email] = { ...userData }; // Preserve user data without orders_history, inbox
        delete signUpData.customers[currentEmail]; // Delete the old email key
      } else {
        // If the email hasn't changed, just update the userData
        signUpData.customers[currentEmail] = { ...userData };
      }

      // Save the updated userData
      console.log("Saving updated signUpData to localStorage:", signUpData);
      localStorage.setItem("signUpData", JSON.stringify(signUpData));

      // Update sessionStorage to reflect the email change if necessary
      if (email !== currentEmail) {
        sessionData.session.email = email;
        sessionStorage.setItem("currentSession", JSON.stringify(sessionData));
        console.log("Session updated:", sessionData);
      }

      // Success message
      alert("Profile updated successfully!");
    } else {
      console.log("No changes detected, nothing saved.");
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const profilePicture = document.querySelector(".tab-content img");
  const fileInput = document.querySelector(".account-settings-fileinput");
  const resetButton = document.querySelector(".btn-default");
  const avatarURL = "./Assests/images/profileimage.jpg"; // Default avatar image

  // Ensure profile picture element exists
  if (!profilePicture) {
    console.error("Profile picture element not found.");
    return;
  }

  // Get current session email to reference the correct user in localStorage
  const sessionData = JSON.parse(sessionStorage.getItem("currentSession"));
  const currentEmail = sessionData ? sessionData.session.email : null;

  if (!currentEmail) {
    console.error("No current email found in session.");
    return;
  }

  // Load the image from signUpData in localStorage if it exists
  const signUpData = JSON.parse(localStorage.getItem("signUpData"));
  if (signUpData && signUpData.customers && signUpData.customers[currentEmail]) {
    const userData = signUpData.customers[currentEmail];
    const savedImageSrc = userData.imgsrc || avatarURL; // Use saved image or default avatar
    profilePicture.src = savedImageSrc;
  } else {
    profilePicture.src = avatarURL; // Default avatar if no user data is found
  }

  // function to validate uploaded file
  function validateImage(file) {
    const allowedExtensions = ["image/jpeg", "image/png", "image/gif"];
    const maxFileSize = 800 * 1024; // 800 KB

    if (!allowedExtensions.includes(file.type)) {
      alert("Allowed file types: JPG, PNG, GIF.");
      return false;
    }
    if (file.size > maxFileSize) {
      alert("File size exceeds 800 KB.");
      return false;
    }
    return true;
  }

  // Handle file input change
  fileInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file && validateImage(file)) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64Image = e.target.result;
        profilePicture.src = base64Image;

        // Save the base64 string to imgsrc in signUpData in localStorage
        if (signUpData && signUpData.customers && signUpData.customers[currentEmail]) {
          signUpData.customers[currentEmail].imgsrc = base64Image;
          localStorage.setItem("signUpData", JSON.stringify(signUpData));
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Reset input if invalid
      fileInput.value = "";
    }
  });

  // Handle reset button click
  resetButton.addEventListener("click", function () {
    profilePicture.src = avatarURL;

    // Set imgsrc to an empty string in localStorage (update it to empty)
    if (signUpData && signUpData.customers && signUpData.customers[currentEmail]) {
      signUpData.customers[currentEmail].imgsrc = "";
      localStorage.setItem("signUpData", JSON.stringify(signUpData));
    }
  });
});
setActiveLink = function () {
  const pathName = window?.location?.pathname?.toLowerCase();
  if (pathName.includes("home") && pathName) {
    document.getElementById("home-link")?.classList?.add("active");
  } else if (pathName.includes("about") && pathName) {
    document.getElementById("about-link")?.classList?.add("active");
  } else if (pathName.includes("contact") && pathName) {
    document.getElementById("contact-link")?.classList?.add("active");
  } else if (pathName.includes("service") && pathName) {
    document.getElementById("service-link").classList?.add("active");
  } else {
  }
};
