var JWR = JWR || {};

jQuery(document).ready(function($) {
	
	console.log('docready');
	
	JWR.BGExpand.init();//$('#thumb-wrapper a').first().attr('href'));
	JWR.Zoom.init();
	JWR.TimeBG.init();
	
	$('.thumb').hover(function(evt) {
		$(evt.currentTarget).addClass('hover-on');
	}, function(evt) {
		$(evt.currentTarget).removeClass('hover-on');
	});
	
	$('#thumb-wrapper a').click(function(evt) {
		//console.log(evt);
		evt.preventDefault();
		
		//TODO: show overlay on selected thumb
		//TODO: add ptg info below canvas
		JWR.BGExpand.loadImage(evt.currentTarget.href);
		JWR.Zoom.checkClose();

		return false;

	});
	
	$('#thumb-wrapper a').first().click();

});