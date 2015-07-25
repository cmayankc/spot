(function(ng) {

	'use strict';

	// main module
	ng.module('spot-app')

	// filtersPopover Directive Declaration
	.directive('filtersPopover', FiltersPopover);

	// FiltersPopover Injectables
	FiltersPopover.$inject = ['$compile', '$document', '$q', '$http', '$templateCache'];

	// FiltersPopover Definition
	function FiltersPopover($compile, $document, $q, $http, $templateCache) {
		return {
			// restricts the directive to be used as an attribute
			restrict: 'A',
			// link function
			link: function($scope, $element) {
				// local variables
				var container_ = $document.find('body'),
					popover_ = null,
					status_ = 'closed';

				// load the template
				$q.when(loadTemplate())
				.then(function(response) {
					// popover markup
					popover_ = ng.element(response.data);

					// get the team filters
					$scope.vm.getFilters('team');
					
					// get the role filters
					$scope.vm.getFilters('role');

					// compile the template
					$compile(popover_)($scope);

					// append the template to the container
					ng.element(container_).append(popover_);
				});

				// click handler
				$element.on('click', function(event) { 
					// if the popover is not open, open it
					if(status_ !== 'open') {
						// stop event from propagating
						event.stopImmediatePropagation();
						// get the container and popover rectangles to position it
						var parentRect = getBoundingClientRect($element[0]),
							popoverRect = getBoundingClientRect(popover_[0]),
							left = parentRect.right - popoverRect.width + 8,
							top = parentRect.bottom + 11;

						// show the popover and position it
						popover_.css({
		                	visibility: 'visible',
		                	left: left+'px',
		                	top: top+'px'
		                });

						// set the status to be 'open'
		                status_ = 'open';
					} else {
						// stop event from propagating
		            	event.stopImmediatePropagation();
		            	// hide the popover when its visible and clicked again
		            	popover_.css('visibility', 'hidden');
		            	// set the status to be clsed
		            	status_ = 'closed';
		            }
	            });

				// loads the directive either from $templateCache or using AJAX
				function loadTemplate() {
					// template url
	            	var url = '/spot/partials/filters.html';
					return $templateCache.get(url) || $http.get(url, { cache : true });
				}

				// utility function to get the element rect
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

		        $scope.$watch('filterSelection', function(nv, ov) {
		        	if(!nv || $scope.filters) {
		        		return;
		        	}
		        	
		        	if(!nv.teamOn) {
		        		ng.forEach($scope.filters.team, function(team) {
							team.selected = false;
						});
		        	}
		        	if(!nv.roleOn) {
		        		ng.forEach($scope.filters.role, function(role) {
							role.selected = false;
						});
		        	}
		        });

		        // remove the popover when scope is destroyed
		        $scope.$on('$destroy', function() {
					popover_.remove();
				});
			}
		};
	}

})(angular);