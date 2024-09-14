jQuery( document ).ready( function( $ )
{
	var DNDMI =
	{
		draggedElement : null,
		
		fakeDropPlaceholder : '<li class="menu-item-depth-0 sortable-placeholder fake-placeholder-for-drop" style="text-align: center;line-height: 35px;">'+dndmi.fakeDropPlaceholder+'</li>',

		fakeAddingElSimulator : '<li class="menu-item" id="_menu_item_$$id$$"><div class="menu-item-bar"><div class="menu-item-handle"><span class="item-title"><span class="menu-item-title" style="cursor: move;">$$title$$</span></span><span class="item-controls" style="top: 8px;right: 0;"><span class="spinner" style="visibility: visible;"></span></span></div></div></li>',

		init : function()
		{
			// add draggble attribute to all menu items (left)
			$( '.menu-item-title, #customlinkdiv' ).attr( 'draggable', 'true' ).css( 'cursor', 'move' );

			$( document ).on( 'dragstart', '.menu-item-title, #customlinkdiv', DNDMI.createFakeDropArea );

			$( document ).on( 'dragend', '.menu-item-title, #customlinkdiv', DNDMI.removeFakeDropArea );
			
			$( document ).on( 'dragover', '.fake-placeholder-for-drop', function( event ) { event.preventDefault() } );
			
			$( document ).on( 'drop', '.fake-placeholder-for-drop', DNDMI.createMenuItem );
		},

		createFakeDropArea : function( e )
		{
			// first append a fake drappable are to begin of the menu items
			$( '#menu-to-edit' ).append( DNDMI.fakeDropPlaceholder );

			$( 'li.menu-item' ).each( function( index, el )
			{	
				if ( $( el ).hasClass( 'menu-item-depth-0' ) )
				{
					$( el ).before( DNDMI.fakeDropPlaceholder );
				}
			} );

			DNDMI.draggedElement = e.srcElement || e.target;
		},

		removeFakeDropArea : function()
		{
			// remove all fake drop area placeholders
			$( '.fake-placeholder-for-drop' ).remove();

			DNDMI.draggedElement = null;
		},

		createMenuItem : function( e )
		{
			if ( e.stopPropagation )
			{
				e.stopPropagation(); // stops the browser from redirecting.
			}

			// setup initial params
			var $AjaxParams =
			{
				'action': 'add-menu-item',
				'menu': $( '#menu' ).val(),
				'menu-settings-column-nonce': $( '#menu-settings-column-nonce' ).val()
			};

			if ( $( DNDMI.draggedElement ) )
			{
				var $targetEl = DNDMI.draggedElement;

				var $targetInput = $( $targetEl ).find( 'input' );

				var $title = $( $targetEl ).text();

				var $id = _.random( 1, Number.MAX_SAFE_INTEGER );

				var $parent = $( $targetEl ).closest('li');

				if ( $( $targetEl ).hasClass( 'customlinkdiv' ) )
				{	
					$title = $( $targetEl ).find( '#custom-menu-item-name' ).val();

					$parent = $( $targetEl ).closest('div#customlinkdiv');
				}

				$( this ).after( DNDMI.fakeAddingElSimulator.replace( '$$title$$', $title ).replace( '$$id$$', $id ) );

				// get all menu item inputs
				var inputs = $( $parent ).find( ':input' );

				// now add all other hidden fields of the menu item
				$( inputs ).each( function( index, el )
				{    
					$AjaxParams[el.name] = $( el ).val();
				} );

				DNDMI.callAjax( $AjaxParams , $id );
			}

			return false;
		},

		callAjax : function( $params, id )
		{
			// request it to wp backend
			$.post( ajaxurl, $params, function( menuMarkup )
			{	
				menuMarkup = $.trim( menuMarkup ); // Trim leading whitespaces.

				$( '#_menu_item_' + id ).replaceWith( menuMarkup );
			} );
		}
	};

	// if drag & drop supported for that particular browser
	if( 'draggable' in document.createElement( 'span' ) )
	{	
		DNDMI.init();
	}
} );