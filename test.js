(function(win,doc,url,blockID){
	var scripts = doc.getElementsByTagName('script'),fjs=scripts[scripts.length-1];
	// store the name of the adserver object
	win.adserverObject = 'ads';
	
	
	// check whether the adserver object is defined
	if (!('ads' in win)){
		
		// define the adserver object
		win.ads = function(){
			win.ads.q.push(arguments);
		};
		
		// create the queue
		win.ads.q = [];
		
	}
	
	// store the current timestamp
	win.ads.l = (new Date()).getTime();
	
	// Create a div for the advert to show in
	var span = doc.createElement('span');
	span.id=blockID;
	span.className ="ad-server-advert";
	fjs.parentNode.insertBefore(span,fjs);
	
	// create a new script element
	var script   = doc.createElement('script');
	script.src   = url;
	script.async = true;
	script.id = "ad-server-script";
	
	// insert the script element into the doc
	if(!doc.getElementById("ad-server-script")) {
		fjs.parentNode.insertBefore(script,fjs);
	}
	
})(window,doc,'script','//adverts.local/script',blockID);