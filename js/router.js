/*
This is a router for a very simplistic CMS. It's browser based and requires
no PHP or SQL backend. 

It works by intercepting all links that end in *.phtml and dynamically 
loading them in the #dynamic-container unless a data-target is specified

This was hacked together in a few hours and comes with NO WARRANTY

Syntax:
<a href="pages/index.html" data-target="#target-div" data-history="yes">
*/


$(document).ready(function() {
	var router = new Router();
	router.init();
});


var Router = function(_defaultContainer, index) {
	// Check for HTML5 history API
	this.html5history = (window.history && history.pushState) ? true : false;
	this.defaultContainer = _defaultContainer || '#dynamic-container';
	index = index || 'pages/index.phtml';
	var that = this; 
	
	/* init()
	Initializes the router, loading the first page and setting the hooks */
	this.init = function() {
	
		// If URL doesn't contain reference to a page, load the index.phtml
		// Otherwise load the page from the URL#hash
		if(document.location.hash == "") {
			this.loadPage(index);
		} else { 
			this.loadPage(window.location.hash.slice(1));
		}
	
		//Load previous pages if user pushes 'Back' button and browser supports it
		if(this.html5history) {
			window.addEventListener("popstate", function(event){
				if(event.state && event.state.partial) {
					console.log('going back in history',event);
					var page = $.ajax({
						url: event.state.partial,
						type: 'GET',
						success: function(data) {
							$(that.defaultContainer).html(data);
							that.ajaxify();
						}
					});
				}
			});
		}
	}
	
	/* ajaxify()
	Hooks all <a> elements that link to *.phtml to
	load their content through AJAX. 
	
	Links who's target doesn't match defaultContainer
	are not saved to history by default. */
	this.ajaxify = function ajaxify() {
		console.log('ajaxifying');
		$('a[href$=phtml]').off('.router');
		$('a[href$=phtml]').on('click.router',function(e) {
			e.preventDefault();
			var link = $(this).attr('href');
			var target      = $(this).data('target') || that.defaultContainer;
			var saveHistory = $(this).data('history') || ((target == that.defaultContainer) ? 'yes' : 'no');
			console.log('clicked', link);
			that.loadPage(link, target, saveHistory);
		});
		$("[data-load]").each(function(index) {
			var pageLink = $(this).data('load');
			$(this).load(pageLink);
		});
	};
	
	/* pageLoadCallback(link)
  Callback when a new page is loaded through ajax.
  Saves page in history and ajaxifies the new page */
	this.pageLoadCallback = function pageLoadCallback(link, saveHistory) {
		console.log('pushing to history', link);
		if(this.html5history && saveHistory != 'no') {
			history.pushState({partial: link},null,'#'+link);
		}
		this.ajaxify();	
	}
	
	/* loadPage(link, target)
	AJAX load the link into the target container.
	If target is left blank, #dynamic-container is 
	assumed */
	this.loadPage = function(link, target, saveHistory) {
		target = target || this.defaultContainer;
		saveHistory = saveHistory || 'yes';
		console.log('loading page ' + link + ' into ' + target);
		$(target).load(link, function() {
			that.pageLoadCallback(link, saveHistory); //Load and perform callback
		});
	}
	
}

