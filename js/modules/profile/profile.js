(function(ng) {

	'use strict';

	// main module
	ng.module('spot-app')

	// directive declaration
	.directive('profile', Profile);

	// Profile injectables
	Profile.$inject = ['$compile', '$document', '$q', '$http', '$templateCache'];

	// Profile Definition
	function Profile($compile, $document, $q, $http, $templateCache) {
		return {
			// restrict the directive to be used as an attribute
			restrict: 'A',
			// isolated scope
			scope: {
				data: '=',
				templateUrl: '@'
			},
			// link function
			link: function($scope, $element) {
				// local variables
				var container_ = $document.find('body'),
					popover_ = null;

				// loads the template
				$q.when(loadTemplate($scope.templateUrl))
				.then(function(response) {
					// popover markup
					popover_ = ng.element(response.data);
					// compile the markup with the scope
					$compile(popover_)($scope);
					// append the html to the container
					ng.element(container_).append(popover_);
				});

				// 'mouseover' handler to show the directive
				$element.on('mouseover', function() { 
					// show the popover
					popover_.css('visibility', 'visible');
					// get the elements' rect to position it
	                var parentRect = getBoundingClientRect($element[0]),
						popoverRect = getBoundingClientRect(popover_[0]),
						left = parentRect.right,
						top = parentRect.top;

					// show the popover and position it
					popover_.css({
	                	visibility: 'visible',
	                	left: left+'px',
	                	top: top+'px'
	                });
	            });

				// 'mouseout' handler to hide the popover
	            $element.on('mouseout', function() {
	            	// stop event from propagating
	            	event.stopImmediatePropagation();
	            	// hide the popover
	            	popover_.css('visibility', 'hidden');
	            });

	            // load template either form $templateCache or using AJAX
	            function loadTemplate(url) {
					return $templateCache.get(url) || $http.get(url, { cache : true });
				}

				// utility function to get the element's rect
	            function getBoundingClientRect(elm) {
		            var w = window;
		            var doc = document.documentElement || document.body.parentNode || document.body;
		            var x = (ng.isDefined(w.pageXOffset)) ? w.pageXOffset : doc.scrollLeft;
		            var y = (ng.isDefined(w.pageYOffset)) ? w.pageYOffset : doc.scrollTop;
		            var rect = elm.getBoundingClientRect();

		            if (x || y) {
		              return {
		                bottom:rect.bottom+y,
		                left:rect.left + x,
		                right:rect.right + x,
		                top:rect.top + y,
		                height:rect.height,
		                width:rect.width
		              };
		            }
		            return rect;
		        }

		        // remove the popover when scope is destroyed
		        $scope.$on('$destroy', function() {
					if(popover_) {
						popover_.remove();
					}
				});
			}
		};
	}

})(angular);