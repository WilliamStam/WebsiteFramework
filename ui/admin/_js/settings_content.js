$(document).ready(function () {
	
	$(document).on("click","#scroll-up",function(){
		$(window).scrollTop($(window).scrollTop()-1);
	})
	$(document).on("click","#scroll-down",function(){
		$(window).scrollTop($(window).scrollTop()+1);
	})
	$(document).on("click","#get-content",function(e){
		e.preventDefault();
	
		//$(".ui-sortable",$html).removeClass("ui-sortable");
		
		var $currentHtml = $('<div>').append($("#preview-area").html());
		
		// .find() will now be able to search through all the markup you added
		$currentHtml.find('.ui-sortable').removeClass("ui-sortable");
		$currentHtml.find('.ui-sortable-handle').removeClass("ui-sortable-handle");
		$currentHtml.find('.ui-droppable').removeClass("ui-droppable");
		$currentHtml.find('.ui-draggable').removeClass("ui-draggable");
		$currentHtml.find('.ui-draggable-handle').removeClass("ui-draggable-handle");
		

		
		
		
		
		console.log($currentHtml.html())
	})
	
	$(document).on("mouseenter","#preview-area .row",function(e){
		e.stopPropagation();
		$("#preview-area .hover").removeClass("hover");
		$(this).addClass("hover").parents(".row").removeClass("hover");
	})
	$(document).on("mouseleave","#preview-area .row",function(){
		$("#preview-area .hover").removeClass("hover");
	})
	
	
	
	
	
	
	
	$(window).on("scroll",function(){
		sideMenu()
	})
	
	$(window).on("resize",function(){
		sideMenu()
	})
	
	
	
	
	$(document).on("change","#edit-select",function(){
		$.bbq.pushState({"ID":$(this).val()});
		getData();
	})
	
	$(document).on("change","#choose-side-content",function(){
		side_menu_content()
	})
	$(document).on("change","input[name=row-size-btns]",function(){
		var size = $('input[name=row-size-btns]:checked').val();
		$.bbq.pushState({"size":size});
		side_menu_content()
	})
	getData()
	
	
});


function getData(){
	var ID = $.bbq.getState("ID");
	
	
	$.getData("/admin/data/settings_content/data", {"ID": ID}, function (data) {
		
		
		$("#content-area").jqotesub($("#template-content-area"), data);
		$("#content-area .select2").select2();
		
		
		//$("#left-area").jqotesub($("#template-details"), data);
		
		if ($.bbq.getState("section")){
			$("#choose-side-content").val($.bbq.getState("section"))
		}
		side_menu_content();
		sideMenu();
	})
	
}

function side_menu_content() {
	var section = $("#choose-side-content").val();
	$.bbq.pushState({"section":section});
	
	
	
	if (section == "rows"){
		var size = $.bbq.getState("size")||"sm";
		
		
		
		$("#side-bar-body").load("/admin/resources/rows?size="+size, function () {
			$(window).trigger('resize');
			setupDrag();
		})
	} else {
		var typeID = "1";
		
		$.getData("/admin/data/settings_content/input_list",{"typeID":typeID,"input":section},function(data){
			
			$("#side-bar-body").jqotesub($("#template-inputs-list"), data);
			$(window).trigger('resize');
			setupDrag();
		})
		
	}
	
	
	
	
	
}
function sideMenu(){
	var $rightArea = $("#right-area");
	var $sideBar = $("#side-bar");
	var $sideBarBody = $("#side-bar-body");
	
	var w = $sideBar.width();
	var h = $(window).height();
	var scroll = $(window).scrollTop();
	var sideBarOffset =  Math.floor($sideBar.offset().top);
	var sideBarHeight = h;
	
	
	sideBarHeight = ((h - sideBarOffset) + scroll);

	sideBarHeight = Math.floor(sideBarHeight) - 3;
	
	console.log($sideBar.hasClass("affix")+" | offset:"+sideBarOffset+" | scroll:"+scroll+" | height:"+sideBarHeight)
	$sideBar.affix({
		offset: {
			top: 115
		}
	}).css({width:w,height:sideBarHeight});
	
	$sideBarBody.css("top",$("#side-bar-header").outerHeight())
	
	//$sideBarContent.css({"height":panelBodyHeight,"overflow-y":"auto"});
	
}

function sideMenuold(){
	
	var $sideBar = $("#right-area");
	var w = $sideBar.width();
	var h = $(window).height();
	//$sideBar
	
	
	var $panel = $("#right-area").find(".panel");
	var headerANDfooter = $panel.find(".panel-heading").outerHeight() + $panel.find(".panel-footer").outerHeight();
	
	
	var navbarANDtoolbar = $("#toolbar").outerHeight() + $("body > .navbar-fixed-top").outerHeight();
	
	var of = $("#toolbar").offset();
	var of_ = of.top;
	of = of.top + $("#toolbar").outerHeight();
	
	of = Math.floor(of);
	of_ = Math.floor(of_);
	
	//console.info($("#content-area").offset())
	
	if ($("#toolbar").hasClass("fixed")){
		
	}
	
	var sc = $(window).scrollTop();
	
	var panelBodyHeight = h - (headerANDfooter + navbarANDtoolbar);
	
	panelBodyHeight = h - ((of + navbarANDtoolbar) - sc);
	
	var startOfFunky = (of - navbarANDtoolbar);
	
	if (sc > startOfFunky){
		//panelBodyHeight =  h - navbarANDtoolbar - headerANDfooter;
	}
	
	
	
	
	
	var nn = startOfFunky;
	
	
	
	//console.log("navbarToolbar: "+navbarANDtoolbar + " | toolbar bottom: " + of + " | toolbar off: " + + of_ + " | scroll: " +sc + " | -" + panelBodyHeight + "- | window h: " + h + " | test: " + nn + " | pHF: " + headerANDfooter);
	
	//panelBodyHeight = 365;
	$('#sidebar').affix({
		offset: {
			top: 115 
		}
	}).css({width:w}).find(".panel-body").css({"height":panelBodyHeight,"overflow-y":"auto"});
}
function setupDrag(){
	$(".content-area, #preview-area").sortable({
		revert: 0,
		tolerance: "pointer",
		placeholder:"ui-placeholder-class",
		receive: function(event, ui) {
			ui.helper.first().removeAttr('style'); // undo styling set by jqueryUI
		}
	}).bind('sortstop', function(event, ui) {
		var $item = $(ui.item);
		var decoded = $item.attr("data-draggable");
		if (decoded) {
			$item.html(decoded).removeAttr("data-draggable");
		}
		
		$item = cleanupDrag($item);
		
		
		setupDrag()
		
		
		
		return $item;
	});
	
	
	$("#mockup-rows > .row, #preview-area .row").draggable({
		connectToSortable: ".content-area, #preview-area",
		revert: "invalid",
		addClasses: false,
		helper: function(ui){
			//console.log($(ui.currentTarget).closest("#preview-area").length)
			
			//	console.info(ui);
			var $drag = $(this)
			if ($(ui.currentTarget).closest("#preview-area").length==0){
				$drag = $drag.clone().removeAttr("style");
			} else {
				$drag.removeData("ui-sortable");
				$drag.find("*").removeData("ui-sortable");
			}
			
			
			$drag.addClass("ui-drag-row");
			
			return $drag;
			
		},
		create:function(){
			//	console.log("drag create");	
		},
		start:function(){
			//console.log("drag start");	
		},
		stop:function(){
			cleanupDrag($(this));
		},
		appendTo: "body"
		
	});
	
	
}
function cleanupDrag($item){
	
	$item.removeClass("ui-draggable");
	$item.removeClass("ui-draggable-handle");
	$item.removeClass("ui-draggable-dragging");
	$item.removeClass("ui-sortable-helper");
	$item.removeClass("ui-drag-row");
	return $item;
}