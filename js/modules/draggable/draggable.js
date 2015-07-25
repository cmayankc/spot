(function(ng) {

	'use strict';

	// Global varialbles
	var draggedElement,
		seatToMove = null;

	// app module
	ng.module('spot-app')
	
	// Draggable directive decaration
	.directive('draggable', Draggable);

	// Draggable Definition
	function Draggable() {
		return {
			// isolated scope
			scope: {
				// model is required to access the seat data
				ngModel: '=',
				// callback when the drag is completed
				onDrop: '&'
			},
			// link function
			link: function($scope, $element) {
				// dragstart handler
				$element.on('dragstart', function(event) {
					event.dataTransfer.effectAllowed = 'move';
					// data to be moved
  					event.dataTransfer.setData('modelData', JSON.stringify($scope.ngModel));
  					// storing it to use later when the drop is done
  					seatToMove = $scope.ngModel;
  					// marking this seat as 'vacant'
  					$scope.ngModel = {
  						employee: null,
  						status: 'vacant'
  					};
  					// for the later use
  					draggedElement = $element;
  					// add class 'dragging' to show it in red
  					$element.addClass('dragging');
				});

				// dragsover handler
				$element.on('dragover', function(event) {
					event.preventDefault();
					event.dataTransfer.dropEffect = 'move';
				});

				// drop handler
				$element.on('drop', function(event) {
					event.stopPropagation();
					// if it's not the same element
					if(draggedElement !== $element && ($scope.ngModel && $scope.ngModel.status === 'vacant')) {
						// notify controller when the drag is complete
						$scope.onDrop({message: {
							who: seatToMove.employee.name, 
							from: seatToMove.table, 
							to: $scope.ngModel.table
						}});
						// update the ngModel to seat the employee
						$scope.ngModel = JSON.parse(event.dataTransfer.getData('modelData'));
						// trigger digest cycle
						$scope.$apply();
					}
					return false;
				});

				// dragend handler
				$element.on('dragend', function(event) {
					// remove dragging class when the drag is complete
					$element.removeClass('dragging');
				});
			}
		};
	}

})(angular);