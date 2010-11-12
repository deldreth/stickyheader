/*
 * StickyHeader - jQuery plugin for making simple sticky headers on headered lists of items
 * @author Devin Eldreth
 */

(function ( $ ) {
	/*
	 * Settings object contains the customizable settings for the plugin
	 * header - Defines some CSS selector that is the identifier for header items in the list (defaults '.header')
	 * zindex - A customizable z-index to force the overlap of scrolled headers (defaults 1000)
	 */
	var settings = {
		'header': '.header',
		'zindex' : 1000
	};
	
	// headerList that will store references to headers and their relative offsets
	var headerList = Array();
	
	// The original top of the parent container
	var containerTop = undefined;
	
	/*
     * Object containing plugin accessible methods
     */
    var methods = {
		/*
         * Initialize the plugin on a list of elements
         * Takes a list of options, see var settings for available options
         */
        init : function ( options ) {            
            if ( options ) {
                $.extend(settings, options);
            }
            
            containerTop = this.offset().top;
            
            // Setup the list
            methods['_setupList'].apply( this, Array.prototype.splice.call(arguments, 1) );

			/*
			 * Bind to the lists scroll event and begin using the magic
			 */
            this.scroll( function ( event ) {
                var previous;

				/*
				 * Look at each available element in the header list
				 * Determine if the lists scrollTop is greater than that elements offset
				 * and set the previous (sticky pointer?) to that header
				 */
                $.each( headerList, $.proxy( function ( i, element ) {
                    if ( $(this).scrollTop() >= element.offset ) {
                        previous = element.header;
                    }
                }, this));

				/*
				 * If the current pointer (previous) doesn't have the class sticky
				 * clear the custom styles on all other list items, add the sticky class
				 * and the rest of the custom styles
				 */
                if ( !previous.hasClass('sticky') ) {
                    $.each( headerList, function ( i, element ) {
                        element.header.removeClass('sticky')
							.attr('style', '')
							.css('position', 'relative')
							.css('z-index', settings.zindex);
                    });
                    
                    previous.addClass('sticky')
						.css('position', 'absolute')
						.css('top', '0px')
						.css('z-index', settings.zindex - 1)
						.css('width', '100%');
                }
                
                /*
                 * Always keep that current header at the top of the scrollable list
                 */
                previous.css('top', $(this).scrollTop());

				/*
				 * In order to prevent a pop effect of the first non-header item set its
				 * top margin to the height of the first header
				 */
                $(this).find(settings.header).first().next().css('margin-top', $(settings.header).height());
            });
        },
        
        /*
         * Private method for setting up the list of elements, extracting out the header elements
         * getting their relative offset to the container and pushing all that into a list of headers
         */
        _setupList : function () {
			// Force the parent container positioning to be relative, making header offsets also relative
            this.css('position', 'relative');

            $(settings.header).css('z-index', settings.zindex);
            
            $.each( this.find(settings.header), function ( i, header ) {
                var object = {
                    offset: $(header).offset().top - containerTop,
                    header: $(header)
                };

                headerList.push(object);
            });
		}
    };

	/*
     * Add stickyheader to the jQuery namespace executing any methods
     * that are available of initialize with a set of available options
     */
    $.fn.StickyHeader = function ( method ) {
        if ( methods[method] ) {
            return methods[method].apply(this, Array.prototype.splice.call(arguments, 1));
        }
        else if ( typeof method === 'object' || !method ) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Plugin has no such method: ' + method);
        }
    };
}) ( jQuery );


$('#list').StickyHeader();
