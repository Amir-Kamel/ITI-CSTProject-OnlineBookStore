$(document).ready(function () {
  $.validator.addMethod(
    "pattern",
    function (value, element, param) {
      return this.optional(element) || param.test(value);
    },
    "Invalid format."
  );

  $("#account-form").validate({
    rules: {
      username: {
        required: true,
        pattern: /^[a-zA-Z]+$/,
      },
      email: {
        required: true,
        email: true,
      },
      "current-password": {
        required: true,
        minlength: 8,
      },
      "new-password": {
        required: true,
        minlength: 8,
      },
      "repeat-password": {
        equalTo: "[name='new-password']",
        minlength: 8,
      },
    },
    messages: {
      username: {
        required: "Please enter your username",
        pattern: "Username can only contain letters",
      },
      email: {
        required: "Please enter your email address",
        email: "Please enter a valid email address",
      },
      "current-password": {
        required: "Please enter your current password",
        minlength: "Password must be at least 8 characters long",
      },
      "new-password": {
        required: "Please enter a new password",
        minlength: "Password must be at least 8 characters long",
      },
      "repeat-password": {
        equalTo: "Passwords do not match",
        minlength: "Password must be at least 8 characters long",
      },
    },
  });

  $("#save-button").click(function () {
    if ($("#account-form").valid()) {
      var currentPasswordInput = $("input[name='current-password']").val();
      var storedPassword = localStorage.getItem("currentPassword");

      if (storedPassword === null || currentPasswordInput === storedPassword) {
        localStorage.setItem("username", $("input[name='username']").val());
        localStorage.setItem("name", $("input[name='name']").val());
        localStorage.setItem("email", $("input[name='email']").val());
        localStorage.setItem("company", $("input[name='company']").val());

        // Update the current password in local storage
        localStorage.setItem(
          "currentPassword",
          $("input[name='new-password']").val()
        );

        alert("Data saved to local storage!");
      } else {
        alert("Current password is incorrect.");
      }
    } else {
      alert("Please fill out the form correctly.");
    }
  });
});
