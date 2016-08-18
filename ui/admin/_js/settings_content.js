$(document).ready(function () {
	
	$(document).on("click", "#scroll-up", function () {
		$(window).scrollTop($(window).scrollTop() - 1);
	});
	$(document).on("click", "#scroll-down", function () {
		$(window).scrollTop($(window).scrollTop() + 1);
	});
	$(document).on("click", "#get-content", function (e) {
		e.preventDefault();
		console.log(getContents())
	});
	
	$(document).on("dblclick", "#preview-area .row", function (e) {
		e.preventDefault();
		e.stopPropagation();
		var $this = $(this);
		var $html = $('<div>').append($this.clone())
		
		
		
		var data = {
			row: getContents($html)
		};
		$("#form-modal").jqotesub($("#template-modal-row-dbl-click"), data).modal("show")
		
		$.doTimeout(500,function(){
			var cm = CodeMirror.fromTextArea(document.getElementById('row-edit-field'), {
				mode : "xml",
				htmlMode: true,
				lineNumbers:false,
				//viewportMargin: "Infinity",
				lineWrapping: true,
			});
			
			cm.setSize(null, "auto");
		});
		$("#form-row-edit").data("row",$this);
		
	});
	
	$(document).on("submit","#form-row-edit",function(e){
		e.preventDefault();
		var $this = $(this);
		$this.data("row").replaceWith($("#row-edit-field").val());
		$("#form-modal").modal("hide");
		setupDrag();
	});
	
	
	
	
	$(document).on("mouseenter", "#preview-area .row", function (e) {
		//e.stopPropagation();
		$("#preview-area .hover").removeClass("hover");
		//console.log($(e.currentTarget))
		$($(this).get(0)).addClass("hover");
	});
	$(document).on("mouseleave", "#preview-area .row", function () {
		$("#preview-area .hover").removeClass("hover");
	});
	
	$(document).on("submit", "#form", function (e) {
		e.preventDefault();
		var $this = $(this);
		var data = $this.serializeArray();
		data.push({name: 'template', value: getContents()});
		
		$.post("/admin/save/settings_content/form?ID=" + $.bbq.getState("ID"), data, function (result) {
			result = result.data;
			validationErrors(result, $this);
			if (!result.errors) {
				if (typeof getData == 'function') {
					getData();
				}
			}
		})
		
	});
	
	$(window).on("scroll", function () {
		sideMenu()
	});
	
	$(window).on("resize", function () {
		sideMenu()
	});
	
	$(document).on("change", "#edit-select", function () {
		$.bbq.pushState({"ID": $(this).val()});
		getData();
	})
	
	$(document).on("change", "#choose-side-content", function () {
		side_menu_content()
	})
	$(document).on("change", "input[name=row-size-btns]", function () {
		var size = $('input[name=row-size-btns]:checked').val();
		$.bbq.pushState({"size": size});
		side_menu_content()
	})
	getData()
	
});

function getData() {
	var ID = $.bbq.getState("ID");
	
	$.getData("/admin/data/settings_content/data", {"ID": ID}, function (data) {
		
		$("#content-area").jqotesub($("#template-content-area"), data);
		
		//$("#left-area").jqotesub($("#template-details"), data);
		
		if ($.bbq.getState("section")) {
			$("#choose-side-content").val($.bbq.getState("section"))
		}
		$("#content-area .select2").select2();
		
		side_menu_content();
		sideMenu();
	})
	
}

function side_menu_content() {
	var section = $("#choose-side-content").val();
	$.bbq.pushState({"section": section});
	
	if (section == "rows") {
		var size = $.bbq.getState("size") || "sm";
		
		$("#side-bar-body").jqotesub($("#template-row-list"), {"size": size});
		
		setupDrag();
		$(window).trigger('resize');
	} else {
		var typeID = "1";
		
		$.getData("/admin/data/settings_content/input_list", {"typeID": typeID, "input": section}, function (data) {
			
			$("#side-bar-body").jqotesub($("#template-inputs-list"), data);
			$(window).trigger('resize');
			setupDrag();
		})
		
	}
	
}
function getContents($currentHtml) {
	
	if (!$currentHtml){
		$currentHtml = $('<div>').append($("#preview-area").html());
	}
	
	
	// .find() will now be able to search through all the markup you added
	$currentHtml.find('.hover').removeClass("hover");
	$currentHtml.find('.ui-sortable').removeClass("ui-sortable");
	$currentHtml.find('.ui-sortable-handle').removeClass("ui-sortable-handle");
	$currentHtml.find('.ui-droppable').removeClass("ui-droppable");
	$currentHtml.find('.ui-draggable').removeClass("ui-draggable");
	$currentHtml.find('.ui-draggable-handle').removeClass("ui-draggable-handle");
	
	return $currentHtml.html();
}
function sideMenu() {
	var $rightArea = $("#right-area");
	var $sideBar = $("#side-bar");
	var $sideBarBody = $("#side-bar-body");
	
	var w = $sideBar.width();
	var h = $(window).height();
	var scroll = $(window).scrollTop();
	var sideBarOffset = Math.round($sideBar.offset().top);
	var sideBarHeight = h;
	
	sideBarHeight = ((h - sideBarOffset) + scroll);
	
	sideBarHeight = Math.round(sideBarHeight) - 10;
	
	//console.log($sideBar.hasClass("affix")+" | offset:"+sideBarOffset+" | scroll:"+scroll+" | height:"+sideBarHeight)
	$sideBar.affix({
		offset: {
			top: 118
		}
	}).css({width: w, height: sideBarHeight});
	
	$sideBarBody.css("top", $("#side-bar-header").outerHeight())
	
	//$sideBarContent.css({"height":panelBodyHeight,"overflow-y":"auto"});
	
}

function setupDrag() {
	$(".content-area, #preview-area").sortable({
		revert: 0, 
		tolerance: "pointer", 
		placeholder: "ui-placeholder-class", 
		receive: function (event, ui) {
			ui.helper.first().removeAttr('style'); // undo styling set by jqueryUI
		}
	}).bind('sortstop', function (event, ui) {
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
		helper: function (ui) {
			//console.log($(ui.currentTarget).closest("#preview-area").length)
			
			//	console.info(ui);
			var $drag = $(this)
			if ($(ui.currentTarget).closest("#preview-area").length == 0) {
				$drag = $drag.clone().removeAttr("style");
			} else {
				$drag.removeData("ui-sortable");
				$drag.find("*").removeData("ui-sortable");
			}
			
			$drag.addClass("ui-drag-row");
			
			return $drag;
			
		}, 
		create: function () {
			//	console.log("drag create");	
		}, 
		start: function () {
			//console.log("drag start");	
		}, 
		stop: function () {
			cleanupDrag($(this));
		}, 
		appendTo: "body"
		
	});
	
}
function cleanupDrag($item) {
	
	$item.removeClass("hover");
	$item.removeClass("ui-draggable");
	$item.removeClass("ui-draggable-handle");
	$item.removeClass("ui-draggable-dragging");
	$item.removeClass("ui-sortable-helper");
	$item.removeClass("ui-drag-row");
	return $item;
}