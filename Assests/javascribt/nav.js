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

function updateFavoritesBadge() {
  const loggedInUserEmail = getLoggedInUserEmail();
  if (loggedInUserEmail) {
    const favKey = `${loggedInUserEmail}_fav`;
    let wishlist = JSON.parse(localStorage.getItem(favKey)) || [];
    $("#heartBadge").text(wishlist.length);
  } else {
    $("#heartBadge").text(0);
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
