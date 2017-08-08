import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

// used to display restore password form on login
Session.set("restorePassword", false);

// used to display register template on new user
Session.set("newUser", false);

// used to display update user form instead of details
Session.set("updateProfile", false);

// for variables depending on route position
Session.set("route", false);

// for switching the view and edit template
Session.set("editId", false);

//for expanding panels with more data on view templates
Session.set("expandId", false);

//for expanding dropdowns and/or value selectors/modifiers
Session.set("multiSelect", false);

//for selecting terms and creating checkboxes on set creation
Session.set("newSet", false);

//if editing set, remove term micromanagement (settings button)
Session.set("editSet", false)

//when campaign logic selected
Session.set("campaignLogic", false);

// set to reset when loading campaign terms and used for init() multiselect on load
Session.set("multiselect", false);

// used to display campaign details
Session.set("campaignDetails", false);

// when user loads graph, this stores the id of the graph
Session.set("loadGraph", false);

Template.registerHelper('$eq', function(a, b) {
    return a === b;
});
Template.registerHelper('$add', function(a, b) {
    return a + b;
});

Template.registerHelper('$last', function(a, b) {
    if (a == (b - 1)) {
        return true;
    } else {
        return false;
    }

});
Template.registerHelper('$compareSelected', function(a, b) {
    if (Array.isArray(b)) {
        if ($.inArray(a, b) != -1) {
            return true;
        } else {
            return false;
        }
    } else {
        if (a == b) {
            return true;
        } else {
            return false;
        }
    }
});

Template.PureWin.events({
    'click .btn-card-toggle': function(e) {
        e.preventDefault();
        $(e.target).closest("a").toggleClass("inactive-card active-card");
    },
    'click #create-account': function() {
        Session.set("newUser", true);
    },
    'click #login-from-register': function() {
        Session.set("newUser", false);
    }
})
Template.PureWin.helpers({
    newUser: function() {
        return Session.get("newUser");
    },
    restorePassword: function() {
        return Session.get("restorePassword");
    },
    resetPassword: function() {
        var path = Iron.Location.get().path;
        if (path != "/") {
            path = path.split("?");
            var token = path[1];
            Session.set("resetToken", token);
            return true;
        }
    }
})