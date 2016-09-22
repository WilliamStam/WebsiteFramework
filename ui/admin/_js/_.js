;
toastr.options = {
	"closeButton": false,
	"debug": false,
	"newestOnTop": false,
	"progressBar": false,
	"positionClass": "toast-top-center",
	"preventDuplicates": true,
	"onclick": null,
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "3000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "slideDown",
	"hideMethod": "slideUp"
};



$.fn.modal.Constructor.prototype.enforceFocus =function(){};
var toolbar = [
	['Source'],
	[
		'Cut',
		'Copy',
		'Paste',
		'Find',
		'Replace'
	],
	[
		'Bold',
		'Italic',
		'Underline',
		'StrikeThrough'
	],
	[
		'Styles',
		'Format',
		'Font',
		'FontSize'
	],
	[
		'NumberedList',
		'BulletedList'
	],
	[
		'Outdent',
		'Indent'
	]
];
var toolbar_small = [
	['Source'],
	[
		'Cut',
		'Copy',
		'Paste',
		'Find',
		'Replace'
	],
	[
		'Bold',
		'Italic',
		'Underline',
		'StrikeThrough'
	]
];
var ckeditor_config = {
	height            : '150px',
	toolbar           : toolbar,
	extraPlugins      : 'autogrow',
	autoGrow_minHeight: 150,
	autoGrow_maxHeight: 0,
	removePlugins     : 'elementspath',
	resize_enabled    : false,
	skin : 'bootstrapck,/app/_css/ckeditor/bootstrapck/',
	on :{
		instanceReady : function( ev ){
			this.dataProcessor.writer.setRules( '*',
					{
						indent : false,
						breakBeforeOpen : true,
						breakAfterOpen : false,
						breakBeforeClose : false,
						breakAfterClose : true
					});
		}
	}
};
var ckeditor_config_small = {
	height            : '117px',
	toolbar           : toolbar_small,
	removePlugins     : 'elementspath',
	resize_enabled    : false,
	extraPlugins      : 'autogrow',
	autoGrow_minHeight: 117,
	autoGrow_maxHeight: 0,
	skin : 'bootstrapck,/app/_css/ckeditor/bootstrapck/',
	on :{
		instanceReady : function( ev ){
			this.dataProcessor.writer.setRules( '*',
					{
						indent : false,
						breakBeforeOpen : true,
						breakAfterOpen : false,
						breakBeforeClose : false,
						breakAfterClose : true
					});
		}
	}
};



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
$(document).on("change",".has-error input",function(){
	var $field = $(this);
	$field.closest(".has-error").removeClass("has-error").find(".form-validation").remove();
	submitBtnCounter($field.closest("form"));
})



function validationErrors(data, $form) {
	
	if (!$.isEmptyObject(data['errors'])) {
		
		var i = 0;
		//console.log(data.errors);
		$(".form-validation",$form).remove();
		$.each(data.errors, function (k, v) {
			i = i + 1;
			var $field = $("#" + k);
			//console.info(k)
			var $block = $field.closest(".form-group");
			
			$block.addClass("has-error");
			if ($field.parent().hasClass("input-group")) $field = $field.parent();
			
			
			if (v != "") {
				
				$field.after('<span class="help-block s form-validation">' + v + '</span>');
			}
			if ($block.hasClass("has-feedback")){
				$field.after('<span class="fa fa-times form-control-feedback form-validation" aria-hidden="true"></span>')
			}
			
			
		});
		
		
		
		
		$("button[type='submit']", $form).addClass("btn-danger").html("(" + i + ") Error(s) Found");
		
		if (i>1){
			toastr["error"]("There were " + i + " errors saving the form", "Error");
		} else {
			toastr["error"]("There was an error saving the form", "Error");
		}
		
		
		
	} else {
		toastr["success"]("Record Saved", "Success");
		
	}
	
	//submitBtnCounter($form);
	
	
}

function submitBtnCounter($form) {
	var c = $(".has-error",$form).length;
	var $btn = $("button[type='submit']", $form);
	if (c) {
		$btn.addClass("btn-danger").html("(" + c + ") Error(s) Found");
	} else {
		
		var tx = $btn.attr("data-text")||"Save";
		
		$btn.html(tx).removeClass("btn-danger");
	}
}