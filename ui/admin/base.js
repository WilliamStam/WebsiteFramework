$(document).ready(function(){
	resize();
	$(window).resize(function () {
		$.doTimeout(250, function () {
			resize();
			
		});
	});
	
	$(window).scroll(function (event) {
		scroll();
		// Do something
	});
	
	$(".select2").select2();
})
function resize() {
	var wh = $(window).height();
	var ww = $(window).width();
	var mh = wh - $("#navbar-header").outerHeight() - 6;
	$("#menu-bar").css({"max-height":mh});
	scroll();
	
	$(".panel-fixed").each(function(){
		var $this = $(this);
		var h = $this.find("> .panel-heading").outerHeight();
		var f = $this.find("> .panel-footer").outerHeight();
		var $body = $this.find(".panel-body");
		$body.css({top:h,bottom:f});
		
		
		//	console.log(h)
	});
}
function scroll(){
	var ww = $(window).width();
	var $toolbar = $("#toolbar");
	
	if ($toolbar.length){
				
		
		var toolbartop = $toolbar.offset().top;
		var navbarheight = $(".navbar-fixed-top").outerHeight();
		var toolbarheight = $toolbar.outerHeight();
		var scrollTop = $(window).scrollTop();
		
		$nextElement = $toolbar.next();
		
		var contentOffset = $nextElement.offset().top;
		
		var toolboxtopscroll = (contentOffset - toolbarheight)-15
		
	//	console.log("toolbartop: "+toolbartop+" | navbarheight: "+navbarheight+" | scroll:"+scrollTop + " | toolbar fixed: "+$toolbar.hasClass("fixed")+" | v:"+toolboxtopscroll);
		
		if ((scrollTop > (toolboxtopscroll - navbarheight))&& ww > 768){
			$toolbar.addClass("fixed").css({"top":navbarheight - 1});
			$nextElement.css({"margin-top":$toolbar.outerHeight()+31});
		} else {
			$toolbar.removeClass("fixed");
			$nextElement.css({"margin-top":0});
		}
		
	}
	
}