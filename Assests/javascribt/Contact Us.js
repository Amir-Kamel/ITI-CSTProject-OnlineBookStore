
//using jQuery to validate the contact form
$(document).ready(function () {
  $("#formcontact").on("submit", function (event) {
    let isValid = false;

    const nameinput = $("#name").val().trim();
    const emailinput = $("#email").val().trim();

//validate name
    if (!/^[a-zA-Z\s]{3,}$/.test(nameinput)) {
      isValid = false;
      $("#errorname").removeClass("d-none");
    } else {
      $("#errorname").addClass("d-none");
    }

//validate email address
    if (!/^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,}$/.test(emailinput)) {
      isValid = false;
      $("#erroremail").removeClass("d-none");
    } else {
      $("#erroremail").addClass("d-none");
    }

//prevent form submission if any of the fields are invalid
    if (!isValid) {
      event.preventDefault();
    }
  });
});
