// start waiting for keypress after paper loads
Template.flowchart_paper.onCreated(() => {
    $(document).on('keydown', (e) => {
    	// save on ctrl+s
	    if(e.which == 83 && e.ctrlKey) {
	    	e.preventDefault();
	        $('#save-graph').click();
	        return false;
	    }
	    // delete on delete
	    if(e.which == 46) {
	    	e.preventDefault();
	        $('#clear-graph').click();
	        return false;
	    }
	    // undo on ctrl+z
	    if(e.which == 90 && e.ctrlKey && !e.shiftKey) {
	    	e.preventDefault();
	        $('#undo-graph').click();
	        return false;
	    }
	    // redo on ctrl+shift+z
	    if(e.which == 90 && e.shiftKey && e.ctrlKey) {
	    	e.preventDefault();
	        $('#redo-graph').click();
	        return false;
	    }
    });
});

// clean up after template is removed from DOM
Template.flowchart_paper.onDestroyed(() => {
    $(document).off('keydown');
});