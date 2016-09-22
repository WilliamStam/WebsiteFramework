$(document).ready(function () {
	
	
	
	
	
	$(document).on("submit", "#form", function (e) {
		e.preventDefault();
		var $this = $(this);
		var data = $this.serializeArray();
		
		
		$.post("/admin/save/content_form/form?ID=" + $.bbq.getState("ID") + "&typeID="+_content_type['ID'], data, function (result) {
			result = result.data;
			validationErrors(result, $this);
			if (!result.errors && typeof getData == 'function') {
			//	getData();
			} 
		})
		
	});
	
	
	getData()
	
});

function getData() {
	var ID = $.bbq.getState("ID");
	
	$.getData("/admin/data/content_form/data?type="+_content_type['ID'], {"ID": ID}, function (data) {
		
		$("#content-area").jqotesub($("#template-content-area"), data);
		
		
		$(window).trigger("resize");
	})
	
}
