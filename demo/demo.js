(function ( $ ) {
	var settings = {
		'header': '.header',
		'zindex' : 1000
	};
	
	var headerList = Array();
	
	var containerTop = undefined;
	
    var methods = {
        init : function ( options ) {            
            if ( options ) {
                $.extend(settings, options);
            }
            
            containerTop = this.offset().top;
            
            methods['_setupList'].apply( this, Array.prototype.splice.call(arguments, 1) );

            this.scroll( function ( event ) {
                var previous;

                $.each( headerList, $.proxy( function ( i, element ) {
                    if ( $(this).scrollTop() >= element.offset ) {
                        previous = element.header;
                    }
                }, this));

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
                
                previous.css('top', $(this).scrollTop());

                $(this).find(settings.header).first().next().css('margin-top', $(settings.header).height());
            });
        },
        _setupList : function () {
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


$(document).ready(function ( event ) {
	$('#list').StickyHeader();
});
