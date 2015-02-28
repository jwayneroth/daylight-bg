var JWR = JWR || {};

(function($) {

	function Zoom() {}
	
	Zoom.inited = false;
	Zoom.el = null;
	Zoom.innerEl = null;
	Zoom.zoomButton = null;
	Zoom.currentImage = null;
	
	Zoom.init = function() {
		console.log('Zoom:init');
		if(!this.inited) {
			this.inited = true;
			this.el = $('#zoom-wrapper');
			this.innerEl = $('#zoom-inner');
			this.zoomButton = $('#zoom-button');
			this.closeButton = $('#zoom-close-button');
			this.zoomButton.click(this.onZoomButtonClick.bind(this));
			this.closeButton.click(this.onCloseButtonClick.bind(this));
		}
	};
	
	/*
	 * onZoomButtonClick
	*/
	Zoom.onZoomButtonClick = function() {
		if(this.zoomButton.hasClass('disabled')) return;
		this.active = true;
		this.loadImage();
		this.zoomButton.addClass('disabled');
		this.closeButton.removeClass('disabled');
	};
	
	/*
	 * onCloseButtonClick
	*/
	Zoom.onCloseButtonClick = function() {
		if(this.closeButton.hasClass('disabled')) return;
		this.close();
	};
	
	/*
	 * checkClose
	 */
	 Zoom.checkClose = function() {
	 	
	 	if(this.active) this.close();
	 	
	 };
	 
	/*
	 * close
	*/
	Zoom.close = function() {
		
		this.active = false;
		this.innerEl.empty();
		this.el.removeClass('active');
		this.closeButton.addClass('disabled');
		this.zoomButton.removeClass('disabled');
	
	};
	
	/*
	 * loadImage
	*/
	Zoom.loadImage = function() {
		
		var imgName = JWR.BGExpand.getCurrentImageName();
		
		if(!imgName) return;
		
		console.log('Zoom:loadImage: ' + imgName);
		
		var image = new Image();
		$(image).on('load', this.onImageLoaded.bind(this));
		image.src = 'images/full/' + imgName;
		
		this.currentImage = image;
		
	};

	/*
	 * onImageLoaded
	*/
	Zoom.onImageLoaded = function(evt) {
		console.log('Zoom:onImageLoaded', evt);
		this.innerEl
			.html('<img src="' + this.currentImage.src + '" width="' + this.currentImage.width + '" height="' + this.currentImage.height + '">');
		this.el
			.addClass('active');
	}
	
	JWR.Zoom = Zoom;

}(jQuery));