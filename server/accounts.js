import { Accounts } from 'meteor/accounts-base'

// set up email
var uMail = encodeURIComponent("triplei.purewin@gmail.com");
var pMail = encodeURIComponent("iii.purewin");
var server = "smtp.gmail.com";
var port = 465;

process.env.MAIL_URL = 'smtps://' + uMail + ':' + pMail + '@' + server + ':' + port;


Accounts.urls.resetPassword = function(token) {
   return Meteor.absoluteUrl('reset?' + token);
};

Accounts.emailTemplates.siteName = 'PureWin';
Accounts.emailTemplates.from = 'PureWin Admin <gazda@purewin.com>';
Accounts.emailTemplates.enrollAccount.subject = (user) => {
  return `Welcome to PureWin, ${user.profile.name}`;
};
Accounts.emailTemplates.enrollAccount.text = (user, url) => {
  return 'You have been selected to participate in building a better future!'
    + ' To activate your account, simply click the link below:\n\n'
    + url;
};
Accounts.emailTemplates.resetPassword.from = () => {
  // Overrides the value set in `Accounts.emailTemplates.from` when resetting
  // passwords.
  return 'PureWin Password Reset';
};
Accounts.emailTemplates.verifyEmail = {
   subject() {
      return "Activate PureWin now!";
   },
   text(user, url) {
      return `Hey ${user}! Verify your e-mail by following this link: ${url}`;
   }
};