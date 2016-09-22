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
	$(document).on("hover",	"#remove-content-type-btn", function(){
		$(this).toggleClass("btn-danger");
	});
	
	$(document).on("shown.bs.tab",'#content-type-tabs a[data-toggle="tab"]',function(e){
		e.target // newly activated tab
		e.relatedTarget // previous active tab
		$.bbq.pushState({"tab":$(e.target).attr("aria-controls")});
		
		
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
	
	
	$(document).on("dblclick", ".input-item", function (e) {
		e.preventDefault();
		e.stopPropagation();
		var $this = $(this);
		
		var ID = $this.attr("data-id");
		var type = $this.attr("data-type");
		
		$.bbq.pushState({"moduleID":ID});
		
		getModule(type,$this);
	});
	$(document).on("click", ".new-input-btn", function (e) {
		e.preventDefault();
		e.stopPropagation();
		
		var $this = $(this);
		
		var ID = $this.attr("data-id");
		var type = $this.attr("data-type");
		
		$.bbq.pushState({"moduleID":type+"|new"});
		
		getModule(type,$this);
	});
	
	
	
	
	
	
	
	
	$(document).on("submit","#form-row-edit",function(e){
		e.preventDefault();
		var $this = $(this);
		$this.data("row").replaceWith($("#row-edit-field").val());
		$("#form-modal").modal("hide");
		setupDrag();
	});
	
	
	
	
	$(document).on("mouseover", "#preview-area .row", function (e) {
		e.stopPropagation();
		$("#preview-area .hover").removeClass("hover");
		//console.log($(e.currentTarget))
		$($(this).get(0)).addClass("hover");
	});
	$(document).on("mouseleave", "#preview-area .row", function () {
		//$($(this).get(0)).removeClass("hover");
		$("#preview-area .hover").removeClass("hover");
	});
	
	
	
	$(document).on("mouseover", ".input-item", function (e) {
		e.stopPropagation();
		$(".input-item.hover").removeClass("hover");
		//console.log($(e.currentTarget))
		$($(this).get(0)).addClass("hover");
	});
	$(document).on("mouseleave", ".input-item", function () {
		//$($(this).get(0)).removeClass("hover");
		$(".input-item.hover").removeClass("hover");
	});
	
	
	
	
	$(document).on("submit", "#form", function (e) {
		e.preventDefault();
		var $this = $(this);
		var data = $this.serializeArray();
		data.push({name: 'template', value: getContents(false,true)});
		
		$.post("/admin/save/settings_content/form?ID=" + _data['ID'], data, function (result) {
			result = result.data;
			validationErrors(result, $this);
			if (!result.errors && typeof getData == 'function') {
				getData();
			} else {
				sideMenu();
			}
		})
		
	});
	
	$(document).on("submit", "#form-input-details", function (e) {
		e.preventDefault();
		var $this = $(this);
		var data = $this.serializeArray();
		
		$.post("/admin/save/settings_content/input_save?ID=" + $.bbq.getState("moduleID"), data, function (result) {
			result = result.data;
			validationErrors(result, $this);
			if (!result.errors && typeof getData == 'function') {
				
				$("#form-modal").modal("hide");
				toastr["info"]("Save the content type to update the preview pane", "Info");
				side_menu_content();
			} else {
				//sideMenu();
			}
		})
		
	});
	
	$(window).on("scroll", function () {
		sideMenu()
	});
	
	$(window).on("resize", function () {
		
		sideMenu();
	});
	
	
	
	$(document).on("change", "#choose-side-content", function () {
		side_menu_content()
	});
	$(document).on("change", "input[name=row-size-btns]", function () {
		var size = $('input[name=row-size-btns]:checked').val();
		$.bbq.pushState({"size": size});
		side_menu_content()
	});
	getData();
	
});

function getData() {
	var ID =  _data['ID'];
	
	$.getData("/admin/data/settings_content/data", {"ID": ID}, function (data) {
		
		$("#content-area").jqotesub($("#template-content-area"), data);
		
		//$("#left-area").jqotesub($("#template-details"), data);
		
		if ($.bbq.getState("section")) {
			$("#choose-side-content").val($.bbq.getState("section"))
		}
		
		if ($.bbq.getState("moduleID")){
			getModule();
		}
		
		
		if ($.bbq.getState("tab")){
			$("#content-type-tabs a[aria-controls='"+$.bbq.getState("tab")+"']").tab('show');
			
		}
		
		$("#content-area .select2").select2();
		$("#toolbar-heading").jqotesub($("#template-toolbar-heading"), data);
		side_menu_content();
		$(window).trigger("resize");
	},"page-data")
	
}
function getModule(type,$item){
	var ID = $.bbq.getState("moduleID");
	
	$.getData("/admin/data/settings_content/input_data", {"ID": ID,"type":type}, function (data) {
		$("#form-modal").jqotesub($("#template-modal-input-form"), data).modal("show").on("hide.bs.modal",function(){
			$.bbq.removeState("moduleID");
		})
		
	},"module-data")
	
}
function side_menu_content() {
	var section = $("#choose-side-content").val();
	$.bbq.pushState({"section": section});
	
	if (section == "rows") {
		var size = $.bbq.getState("size") || "sm";
		
		$("#side-bar-body").jqotesub($("#template-row-list"), {"size": size});
		
		setupDrag();
		$(window).trigger('resize');
	} else if (section == "panels") {
		
		$("#side-bar-body").jqotesub($("#template-panels-list"), {});
		
		setupDrag();
		$(window).trigger('resize');
	} else {
		var order = $.bbq.getState("list-order");
		var order_by = $.bbq.getState("list-order-by");
		
		$.getData("/admin/data/settings_content/input_list", {"input": section, "order": order, "order_by": order_by}, function (data) {
			
			$("#side-bar-body").jqotesub($("#template-inputs-list"), data);
			$(window).trigger('resize');
			setupDrag();
			orderByControls(data);
		},"input-list-data")
		
	}
	
}
function getContents($currentHtml,saving) {
	
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
	
	$(".input-item",$currentHtml).each(function(){
		var $this = $(this);
		
		var attr = $this.attr('data-id');
		if (typeof attr !== typeof undefined && attr !== false) {
			if (saving){
				$this.replaceWith("<!-- input["+attr+"] -->");
			} else {
				$this.removeAttr("style").html("<!-- [module item] -->");
			}
			
		} else {
			$this.remove();
		}
	});
	var html = $currentHtml.html();
	
	
	
	return html;
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
	orderControlsResize()
}
var t = 0;
function setupDrag() {
	console.log(t++)
	$("#preview-area .input-item").each(function(){
		setupContentBlock($(this))
	})
	
	$(".content-area, #preview-area").sortable({
		revert: 0, 
		tolerance: "pointer", 
		placeholder: "ui-placeholder-class", 
		receive: function (event, ui) {
			ui.helper.first().removeAttr('style'); // undo styling set by jqueryUI
		}
	}).off('sortstop').one('sortstop', function (event, ui) {
		event.stopPropagation();
		var $item = $(ui.item);
		var decoded = $item.attr("data-draggable");
		if (decoded) {
			$item.html(decoded).removeAttr("data-draggable");
		}
		//console.log($item)
		$item = cleanupDrag($item);
		
		setupDrag();
		
		return $item;
	});
	
	$("#mockup-rows > .row, #preview-area .row,#mockup-rows > .panel, #preview-area .panel, .input-item").draggable({
		connectToSortable: ".content-area, #preview-area", 
		revert: "invalid", 
		addClasses: false,
		//snapMode: "inner",
		//snap: ".content-area",
		stack: ".draggable",
		zIndex: 10000,
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
	
	$("#right-area").droppable({
		tolerance: "pointer",
		over: function( event, ui ) {
			$(this).addClass("hover")
		},
		out: function( event, ui ) {
			$(this).removeClass("hover")
		},
		drop: function( event, ui ) {
			$(this).removeClass("hover")
			
			if ($(ui.draggable).closest("#preview-area").length) {
				
				$(ui.helper).remove();
				
				
			}
		}
	})
	
	
	
	
	
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

function setupContentBlock($item){
	//console.log($item)
	if ($item.attr("data-type")=="html"){
		$item.html("<em>"+$item.attr("data-description")+"</em> <span class='badge'>"+$item.attr("data-type")+"</span>");
	} else {
		$item.html("<em>"+$item.attr("data-description")+"</em> [<strong>"+$item.attr("data-name")+"</strong>] <span class='badge'>"+$item.attr("data-type")+"</span>");
	}
	
	return $item;
}
function orderByControls(data){
	
	//$("#order-by-label")
	//$("#order-by-menu")
	
	
	if (data.order){
		$("#order-by").attr("data-order",data.order).html('<i class="fa fa-sort-amount-'+data.order+'"></i>');
	}
	$("#order-by-label").text($("#order-by-menu").find("a[data-col='"+data['order-by']+"']").text())
	
	orderControlsResize()
	
	
	
}
function orderControlsResize(){
	
	$btnGroup = $("#order-by-controls");
	if ($btnGroup.length){
		var width = $btnGroup.width();
		var otherbtns = $("button:not(#order-by-menu-btn)",$btnGroup).map(function(undefined, elem) {
			return $(elem).outerWidth(true);
		}).toArray().reduce(function(prev, curr) {
			return prev + curr;
		}, 0);
		
		var btnWidth = width - otherbtns - 17;
		$("#order-by-menu-btn").width(btnWidth);
	}
	
	
}

$(document).on("click","#order-by-menu a",function(e){
	e.preventDefault();
	var col = $(this).attr("data-col")
	$.bbq.pushState({"list-order-by":col});
	side_menu_content();
})
$(document).on("click","#order-by",function(e){
	e.preventDefault();
	var order = $(this).attr("data-order")=="asc"?"desc":"asc"
	
	
	
	$.bbq.pushState({"list-order":order});
	side_menu_content();
})