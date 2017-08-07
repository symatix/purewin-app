Router.configure({
  layoutTemplate:'PureWin'
});

// GENERAL ROUTES
Router.route("/", function(){ 
  Session.clear();
  Session.set("route", "/");
  this.render('home');
});
Router.route("/profile", function(){
  Session.clear();
  Session.set("route", "/profile");
  this.render('profile');
});
Router.route("/calendar", function(){
  Session.clear();
  Session.set("route", "/calendar");
  this.render('calendar');
});
Router.route("/terms", function(){ 
  Session.clear();
  Session.set("route", "/terms");
  this.render('admin_dashboard');
});
Router.route("/workflow", function(){ 
  Session.clear();
  Session.set("route", "/workflow");
  this.render('admin_workflow');
});
Router.route("/campaign-new", function(){ 
  Session.clear();
  Session.set("route", "/campaign-new");
  this.render('campaign_new');
});
Router.route("/campaign-list", function(){ 
  Session.clear();
  Session.set("route", "/campaign-list");
  this.render('campaign_list');
});
Router.route("/:_id", function(){
  var campaign = Campaigns.findOne({_id:Session.get("campaignDetails")});
  this.render('campaign_edit', {data: campaign});
})

//accounts
Router.route('/reset?:token',{
  action : function () {
    if (this.ready()) {
          Session.set("resetPassword", true);
    }
}

});