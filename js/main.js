var JWR = JWR || {};

jQuery(document).ready(function($) {
	
	console.log('docready');
	
	JWR.BGExpand.init();//$('#thumb-wrapper a').first().attr('href'));
	JWR.Zoom.init();
	JWR.TimeBG.init();
	
	$('#thumb-wrapper a').click(function(evt) {
		//console.log(evt);
		evt.preventDefault();
		JWR.BGExpand.loadImage(evt.currentTarget.href);
		JWR.Zoom.checkClose();
		return false;
	});
	
	$('#thumb-wrapper a').first().click();
	
});