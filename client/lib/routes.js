Router.configure({
  layoutTemplate:'PureWin'
});

// GENERAL ROUTES
Router.route("/", function(){ 
  Session.set("route", "/");
  this.render('home');
});
Router.route("/terms", function(){ 
  Session.set("route", "/terms");
  this.render('admin_dashboard');
});
Router.route("/workflow", function(){ 
  Session.set("route", "/workflow");
  this.render('admin_workflow');
});
Router.route("/campaign", function(){ 
  Session.set("route", "/campaign");
  this.render('campaign');
});