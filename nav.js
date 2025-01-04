// Function to retrieve current session email from sessionStorage
function getLoggedInUserEmail() {
  const currentSession = JSON.parse(sessionStorage.getItem("currentSession"));
  return currentSession?.session?.email;
}

// Function to update the cart badge based on the items in local storage
function updateCartBadge() {
  const loggedInUserEmail = getLoggedInUserEmail();
  if (loggedInUserEmail) {
    const cartKey = `${loggedInUserEmail}_cart`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    $("#cartBadge").text(cart.length);
  } else {
    $("#cartBadge").text(0);
  }
}

// Sign-in function
function signInUser(email) {
  const sessionData = {
    session: {
      email: email,
    },
  };
  sessionStorage.setItem("currentSession", JSON.stringify(sessionData));
  updateCartBadge(); // Update the cart badge after sign-in
}

// Sign-out function
function signOutUser() {
  sessionStorage.removeItem("currentSession");
  updateCartBadge(); // Update the cart badge after sign-out
}

// Ensure the updateCartBadge function is called when the navigation loads
document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();
});


// Function to update the user dropdown menu and handle sign-in/sign-out
function updateUserDropdown() {
  const userDropdownMenu = document.getElementById("userDropdownMenu");
  if (!userDropdownMenu) {
    console.error("User dropdown menu element not found.");
    return;
  }

  const userSession = sessionStorage.getItem("currentSession"); // Check session dynamically
  userDropdownMenu.innerHTML = ""; // Clear the current menu

  if (userSession) {
      // User is logged in
      userDropdownMenu.innerHTML = `
          <li><a class="dropdown-item" href="./profile.html">Your Account</a></li>
          <li><a class="dropdown-item" id="logoutBtn" href="#">Logout</a></li>
      `;

      // Add logout functionality
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
          logoutBtn.addEventListener("click", () => {
              sessionStorage.removeItem("currentSession");
              alert("You have been logged out.");
              window.location.href = "./Login&Register.html"; // Redirect to the login page
          });
      }
  } else {
      // User is not logged in
      userDropdownMenu.innerHTML = `
          <li><a class="dropdown-item" href="./Login&Register.html">Sign in | SignUp</a></li>
      `;
  }
}

// Call the updateUserDropdown function once the page loads
window.onload = function() {
  updateUserDropdown();
};
