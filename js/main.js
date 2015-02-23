var JWR = JWR || {};

jQuery(document).ready(function($) {
	
	console.log('docready');
	
	JWR.DBG.init();
	JWR.Zoom.init();
	
	var d = new Date();
	$('#date').text(d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
	
	setInterval(function() {
		var d = new Date();
		$('#date').text(d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
	}, 1000); 

});