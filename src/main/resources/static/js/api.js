let userMail = null;

function getUserMail() {
    return userMail;
}

function createUser({ name, email, profileImg }) {
    var user = {
        name: name,
        profileImg: profileImg,
        email: email
    };
    $.ajax({
        url: "/api/createPeer",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(user),
        success: function (data) {
            console.log("User created successfully");
            window.location.href = "/home";
        },
        error: function (error) {
            alert(error.responseJSON.message);
        }
    });
    // set userMail to email
    userMail = email;
};