Router.configure({
  layoutTemplate:'PureWin'
});

// GENERAL ROUTES
Router.route("/", function(){ 
  this.render('home');
});
Router.route("/terms", function(){ 
  this.render('admin_dashboard');
});
Router.route("/workflow", function(){ 
  this.render('admin_workflow');
});
Router.route("/campaign", function(){ 
  this.render('campaign');
});