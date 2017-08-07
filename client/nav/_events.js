Template.nav.events({
	'click .side-link-list':function(e){
		$(".droplink").removeClass("open active");
		$(".sub-menu").slideUp();
		$(".side-link-list").removeClass("active");
		//$(".droplink").removeClass("active");

		$(".active-page").removeClass("active-page");
		$(e.target).closest(".side-link-list").addClass("active");
		$(e.target).closest(".side-link-list").find(".active-page-spanner").addClass("active-page");
	},
	'click .sub-menu-link':function(e){
		$(".side-link-list").removeClass("active");
		$(".droplink").removeClass("active");
		$(".droplink").removeClass("open");
		$(".active-page").removeClass("active-page");
		$(e.target).closest(".droplink").addClass("active");
		//$(e.target).closest(".droplink").find(".arrow").addClass("active-page");
	},
    'click .logout': function(e){
        e.preventDefault();
        Meteor.logout();
    },
    'click .goTo-calendar':function(e){
		$(".droplink").removeClass("open active");
		$(".sub-menu").slideUp();
		$(".side-link-list").removeClass("active");
		$(".droplink").removeClass("active");
		$(".active-page").removeClass("active-page");
    },
    'click .goTo-profile':function(e){
		$(".droplink").removeClass("open active");
		$(".sub-menu").slideUp();
		$(".side-link-list").removeClass("active");
		$(".droplink").removeClass("active");
		$(".active-page").removeClass("active-page");
    },
})