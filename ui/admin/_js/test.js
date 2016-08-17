$(document).ready(function(){
	setupDrag()
	
	
});
var t = 0;
var p = 0;
function setupDrag(){
	$(".content-area, #preview-area").sortable({
		revert: true,
		tolerance: "pointer",
		placeholder:"ui-placeholder-class",
		
	}).bind('sortstop', function(event, ui) {
		var $item = $(ui.item);
		var decoded = $item.attr("data-draggable");
		if (decoded) {
			$item.html(decoded).removeAttr("data-draggable");
		}
		$item.removeAttr("style");
		$item.removeClass("ui-draggable");
		$item.removeClass("ui-draggable-handle");
		$item.removeClass("ui-draggable-dragging");
		$item.removeClass("ui-sortable-helper");
		$item.removeClass("ui-drag-row");
		
	
		
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
				$drag = $drag.clone();
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
			$item = $(this);
			$item.removeAttr("style");
			$item.removeClass("ui-draggable");
			$item.removeClass("ui-draggable-handle");
			$item.removeClass("ui-draggable-dragging");
			$item.removeClass("ui-sortable-helper");
			$item.removeClass("ui-drag-row");
		//console.log("drag stop");	
		},
		appendTo: "body"
		
	});
	
	
}