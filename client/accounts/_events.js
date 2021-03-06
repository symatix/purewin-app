Template.login.events({
    'submit form': function(e) {
        e.preventDefault();
        var emailVar = e.target.loginEmail.value;
        var passwordVar = e.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar, function(err, res) {
            if (err) {
                toastr["error"]("" + err);
            }
        });
    },
    'click #forgot-password': function(e) {
        Session.set("restorePassword", true);
    }
});
Template.password_reset.events({
    'submit form': function(e) {
        e.preventDefault();
        var newPw = $("[name='newPassword']").val();
        var repeatPw = $("[name='repeatPassword']").val();
        var token = Session.get("resetToken");

        if (repeatPw == newPw) {
            Accounts.resetPassword(token, newPw, function(err, res) {
                if (!err) {
                    toastr["success"]("Password reset successfull!");
                    Session.set("resetToken", false);
                    Session.set("restorePassword", false);
                } else {
                    toastr["warning"]("Error while reseting password! " + err);
                }
            })
        } else {
            toastr["error"]("Passwords do not match!");
        }
    }
});



Template.register.events({
    'submit form': function(e) {
        e.preventDefault();
        console.log("alo");
        var nameVar = e.target.registerName.value;
        var emailVar = e.target.registerEmail.value;
        var passwordVar = e.target.registerPassword.value;
        if ($('[type="checkbox"]').is(":checked")) {
            Accounts.createUser({
                email: emailVar,
                password: passwordVar,
                profile: {
                    name: nameVar,
                    email: emailVar,
                    job: "Job unknown",
                    avatar: "assets/images/default_user.png",
                    location: "Location unknown",
                    web: "Website uknown",
                    isAdmin:true,
                }
            });
            toastr["info"]("Welcome to PureWin, " + nameVar + "!");
        } else {
            toastr["error"]("Certain somebody has NOT agreed to the terms and policy!");
        }

    }
});
Template.restore.events({
    'submit form': function(e) {
        e.preventDefault();
        var email = $("[type='email']").val();
        console.log(email);

        Accounts.forgotPassword({ email: email }, function(err, res) {
            if (err) {
                toastr["error"]("Error while sending email: " + err);
            } else {
                toastr["success"]("Email with your password was sent!");
            }
        });
    },
    'click #forgot-password': function(e) {
        Session.clear();
    }
});

Template.profile.events({
    'click #edit-profile': function() {
        Session.set("updateProfile", true);
    },
    'click #edit-profile-save': function(e) {
        var name = $("[name='updateName']").val();
        var job = $("[name='updateJob']").val();
        var location = $("[name='updateLocation']").val();
        var email = $("[name='updateEmail']").val();
        var web = $("[name='updateWeb']").val();
        var userId = Meteor.userId();

        if (name == "") {
            name = $("[name='updateName']").attr("placeholder");
        }
        if (job == "") {
            job = $("[name='updateJob']").attr("placeholder");
        }
        if (location == "") {
            location = $("[name='updateLocation']").attr("placeholder");
        }
        if (email == "") {
            email = $("[name='updateEmail']").attr("placeholder");
        }
        if (web == "") {
            web = $("[name='updateWeb']").attr("placeholder");
        }

        var user = {
            name: name,
            job: job,
            location: location,
            email: email,
            web: web,
        }
        console.log(user);
        Meteor.call("editUser", userId, user, function(err, res) {
            if (!err) {
                toastr["success"]("User details changed!");
                Session.set("updateProfile", false);
            } else {
                toastr["error"]("There was an error updating user profile: " + err);
            }
        });
    },
    'click #edit-password': function(e) {
        var oldPw = $("[name='oldPassword']").val();
        var newPw = $("[name='newPassword']").val();
        var repeatPw = $("[name='repeatPassword']").val();

        if (repeatPw == newPw) {
            Accounts.changePassword(oldPw, newPw, function(err, res) {
                if (!err) {
                    $("#toggle-change-password").click();
                    toastr["success"]("Password changed!");
                    return res;
                }
            })
        } else {
            toastr["error"]("Passwords do not match!");
        }
    }
})

Template.users.events({
    'submit form':function(e){
        e.preventDefault();
        var name = $("[name='updateName']").val();
        var job = $("[name='updateJob']").val();
        var location = $("[name='updateLocation']").val();
        var email = $("[name='updateEmail']").val();
        var web = $("[name='updateWeb']").val();
        var status = $("[name='updateStatus']").val();
        var password = $("[name='newPassword']").val();
        var repeatPw = $("[name='repeatPassword']").val();

        if (repeatPw == password) {

            if (job == "") {
                job = "Job unknown";
            }
            if (location == "") {
                location = "Location unknown";
            }
            if (web == "") {
                web = "Website unknown";
            }
            if (status == "true"){
                status = true;
            } else if (status == "false"){
                status = false;
            }
            if(!Session.get("editUser")){
                // if there is not userid in session, generate new user
                Accounts.createUser({
                    email: email,
                    password: password,
                    profile: {
                        name: name,
                        email: email,
                        job: job,
                        avatar: "assets/images/default_user.png",
                        location: location,
                        web: web,
                        isAdmin:status,
                    }
                }, function(err, res){
                    if (!err){
                       toastr["success"]("User "+name+" created successfully!"); 
                        $("#form-create-user").click();
                        document.getElementById("admin-user-create").reset();
                    } else {
                        toastr["error"]("There was an error while creating user: "+err);
                    }
                });
            } else {
                var userId = Session.get("editUser");
                var user = {
                    name: name,
                    job: job,
                    location: location,
                    email: email,
                    web: web,
                    isAdmin:status,
                }
                console.log(user);
                Meteor.call("editUser", userId, user, function(err, res) {
                    if (!err) {

                        if(password != ""){
                            Meteor.call("setPassword", userId, password);
                        }
                        toastr["success"]("User details changed!");
                        Session.set("editUser", false);
                        Session.set("updateProfile", false);
                        $("#form-create-user").click();
                        document.getElementById("admin-user-create").reset();
                    } else {
                        toastr["error"]("There was an error updating user profile: " + err);
                    }
                });

            }
            

        } else {
            toastr["error"]("Passwords do not match!");
        }
    },
    'click .list-delete-user':function(e){
        var id = this._id;
        if (id == Meteor.userId()){
            toastr["error"]("You are trying to delete yourself, permission denied.");
        } else {
            Meteor.call("deleteUser", id, function(err, res){
                if (!err){
                    toastr["success"]("User deleted successfully!"); 
                } else {
                    toastr["error"]("There was an error while deleting user: "+err);
                }
            })  
        }
    },
    'click .list-edit-user':function(e){
        Session.set("editUser", this._id);
        $("#form-create-user").click();
        var id = this._id;
        var user = Meteor.users.findOne(id);
        console.log(user);
        $("[name='updateName']").val(user.profile.name);
        $("[name='updateJob']").val(user.profile.job);
        $("[name='updateLocation']").val(user.profile.location);
        $("[name='updateEmail']").val(user.profile.email);
        $("[name='updateWeb']").val(user.profile.web);
        if(user.profile.isAdmin == true){
            $("option[value='true']").prop('selected', true);
        } else if (user.profile.isAdmin == false){
            $("option[value='false']").prop('selected', true);
        }

        //var password = $("[name='newPassword']").val();
        //var repeatPw = $("[name='repeatPassword']").val();

    },
    'click #user-cancel':function(e){
        e.preventDefault();
        $("#form-create-user").click();
        document.getElementById("admin-user-create").reset();

    }
})