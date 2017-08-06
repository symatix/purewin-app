Template.nav.rendered = function(){
	$("body").append('<script src="assets/plugins/pace-master/pace.min.js"></script><script src="assets/plugins/jquery-slimscroll/jquery.slimscroll.min.js"></script><script src="assets/plugins/switchery/switchery.min.js"></script><script src="assets/plugins/uniform/js/jquery.uniform.standalone.js"></script><script src="assets/plugins/waves/waves.min.js"></script><script src="assets/js/meteor.js"></script><script src="assets/plugins/toastr/toastr.min.js"></script>')

	toastr.options = {
	  "closeButton": false,
	  "debug": false,
	  "newestOnTop": false,
	  "progressBar": false,
	  "positionClass": "toast-bottom-right",
	  "preventDuplicates": false,
	  "onclick": null,
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": "5000",
	  "extendedTimeOut": "1000",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}


}