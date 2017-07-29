Template.nav.events({
	'click .side-link-list':function(e){
		console.log(e.target);
		$(".side-link-list").removeClass("active");
		$(".active-page").removeClass("active-page");
		$(e.target).closest(".side-link-list").addClass("active");
		$(e.target).closest(".side-link-list").find(".active-page-spanner").addClass("active-page");
	}
})