import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

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


Template.registerHelper('$eq', function (a, b) {
      return a === b;
    });
Template.registerHelper('$add', function (a, b) {
      return a + b;
    });

Template.PureWin.events({
	'click .btn-card-toggle':function(e){
		e.preventDefault();
		$(e.target).closest("a").toggleClass("inactive-card active-card");
	}
})