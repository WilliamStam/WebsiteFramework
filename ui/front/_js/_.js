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
}


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



$(window).scroll(function() {
	
});
$(window).resize(function() {
	
});

$(document).ready(function () {
	
});



var ajaxRequests = 0;

function ajaxRequestLoading(){
	if (ajaxRequests>0){
		$('#loadingmask').stop(true,true).fadeIn(10);
	} else {
		$('#loadingmask').stop(true,true).fadeOut(500);
	}
	
}


window.onerror = function() {
	$('#loadingmask').stop(true,true).fadeOut(500);
}


$(document).ajaxSend(function(event, request, settings) {
	
	if (settings.url.indexOf("hiddenajax")!=-1){
		
	} else {
		ajaxRequests = ajaxRequests+1;
		ajaxRequestLoading();
	}
	
});

$(document).ajaxComplete(function(event, request, settings) {
	if (settings.url.indexOf("hiddenajax")!=-1){
		
	} else {
		ajaxRequests = ajaxRequests-1;
		ajaxRequestLoading();
	}
	
	
});

;$(document).ready(function () {
	
	$('[data-toggle="tooltip"]').tooltip();
	$('[data-toggle="popover"]').popover();
	
	
	//$('#loadingmask').stop(true,true).fadeOut(500);
	
	$( document ).ajaxError(function( event, jqxhr, settings, thrownError) {
		//console.log(settings.url.indexOf("true"))
		if (jqxhr.status == 403) {
			alert("Sorry, your session has expired. Please login again to continue");
			window.location.href ="/login";
		} else if (thrownError === 'abort') {
		} else if (settings.url.indexOf("hiddenajax")!=-1) {
			
		} else {
			alert("An error occurred: " + jqxhr.status + "\nError: " + thrownError);
		}
	});
	
	
	
	
	
	$(document).on('click', '.btn-row-details', function (e) {
		var $this = $(this), $table = $this.closest("table");
		var $clicked = $(e.target).closest("tr.btn-row-details");
		var active = true;

		if ($this.hasClass("active") && $clicked) active = false;

		$("tr.btn-row-details.active", $table).removeClass("active");
		if (active) {
			$this.addClass("active");
		}

		var show = $("tr.btn-row-details.active", $table).nextAll("tr.row-details");

		$("tr.row-details", $table).hide();
		if (show.length) {
			show = show[0];
			$(show).show();
		}

	});

	
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
	
	
});




function resize() {
	
	$(".panel-fixed").each(function(){
		var $this = $(this);
		var h = $this.find("> .panel-heading").outerHeight();
		var f = $this.find("> .panel-footer").outerHeight();
		$this.find("> .panel-body").css({top:h,bottom:f});
	//	console.log(h)
	});
}

function updatetimerlist(d, page_size) {
	//d = jQuery.parseJSON(d);
	if (!d || !typeof d == 'object') {
		return false;
	}
	//console.log(d);
	var data = d['timer'];
	var page = d['page'];
	var models = d['models'];
	var menu = d['menu'];




	if (data) {
		
		var highlight = "";
		if (page['time'] > 0.5)    highlight = 'style="color: red;"';

		var th = '<tr class="heading" style="background-color: #fdf5ce;"><td >' + page['page'] + '</td><td class="s g"' + highlight + '>' + page['time'] + '</td></tr>';
		var thm = "";
		if (models) {
			thm = $("#template-timers-tr-models").jqote(models);
		} 
		//console.log(thm)
		var timers = $("#template-timers-tr").jqote(data);
		//console.log(timers)

		//console.log($("#template-timers-tr"))
		//console.log(thm)
		
		$("#systemTimers").prepend(th + timers + thm);
		
		
		
		
		
	}
	
		resize()

};

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

function scroll(){
	
	
}
function uniqueid(){
	// always start with a letter (for DOM friendlyness)
	var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
	do {
		// between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
		var ascicode=Math.floor((Math.random()*42)+48);
		if (ascicode<58 || ascicode>64){
			// exclude all chars between : (58) and @ (64)
			idstr+=String.fromCharCode(ascicode);
		}
	} while (idstr.length<12);
	
	idstr = idstr + (new Date()).getTime();
	return (idstr);
}
function sizeselect2(item) {
	if (!item.id) return item.text; // optgroup
	var str = item.text;
	str = str.split("||");
	str = "<span class='g pull-right'>" + str[1] + "</span><span>" + str[0] + "</span>";
	
	return str;
}


