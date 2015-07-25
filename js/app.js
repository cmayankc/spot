(function(ng) {

	'use strict';

	// Main App Module
	ng.module('spot-app', [])

	// Controller Declaration
	.controller('AppCtrl', AppCtrl);

	// Injectors
	AppCtrl.$inject = ['$scope'];

	// Controller Definition
	function AppCtrl($scope) {

		// Local Variables
		var vm = this,
			draggedElement = null,
			originalTables = [];

		// Exposed Variables
		vm.appLoaded = false;
		vm.tables = [];

		// Exposed Functions
		vm.getFilters = getFilters;
		vm.applySearchFilter = applySearchFilter;
		vm.onDrop = onDrop;

		// Exposed Filters. Filters are on scope, so that they can be watched
		$scope.filters = {
			team:[], 
			role:[]
		};

		// Fetches app configuration
		function fetchConfig() {
			// ng injector
	        var initInjector = ng.injector(['ng']),
	        	// $http service
	        	$http = initInjector.get('$http');

	        // returns a promise which resolves to app configuration
	        return $http.get('config/spot-config.json').then(function(res) {
	            // triggers digest cycle
	            $scope.$apply(function() {
	            	// storing it in a local variable for later use
	            	originalTables = res.data.tables;
	            	// tables for ng-repeat
					vm.tables = originalTables;
					// flag to notify that application has finished loading
					vm.appLoaded = true;

				});
	        }, function(err) {
	        	// error handler
	            throw Error('Error: could not fetch config: err: ' + err);
	        });
	    }

	    // gets filters
	    function getFilters(type) {
	    	var seats = vm.tables.map(function(table) {
				return table.seats;
			}).reduce(function(a, b) {
				return a.concat(b);
			});

			ng.forEach(seats, function(seat) {
				if(seat.employee && $scope.filters[type].indexOf(seat.employee[type]) === -1) {
					$scope.filters[type].push(seat.employee[type]);
				}
			});
			
			$scope.filters[type] = $scope.filters[type].map(function(item) {
				return {name: item, selected: false};
			});
		}

		// apply search filter when typed in the search box, 
		// this is to add 'selected' class instead of adding and removing DOM nodes
		function applySearchFilter() {
			if(!vm.query) {
				return;
			}

			ng.forEach(vm.tables, function(table) {
				ng.forEach(table.seats, function(seat) {
					if(seat.employee && seat.employee.name.toLowerCase().indexOf(vm.query) > -1) {
						seat.searched = true;
					} else {
						seat.searched = false;
					}
				});
			});
		}

		function onDrop(msg) {
			vm.moveConfirmation = msg.who + ' has been moved from Table ' + msg.from + ' to Table ' + msg.to + '. A mail regarding this has been sent to ' + msg.who + '.';
		}

		// deep watch filters to show or hide DOM nodes
		$scope.$watch('filters', function() {
						
			vm.tables = ng.copy(originalTables);

			var selectedTeams = $scope.filters.team.filter(function(team) {
				return team.selected;
			});

			if(selectedTeams.length) {
				selectedTeams = selectedTeams.map(function(team) {
					return team.name;
				});

				ng.forEach(vm.tables, function(table) {
					ng.forEach(table.seats, function(seat) {
						if(seat.employee && (selectedTeams.indexOf(seat.employee.team) > -1)) {
							seat.filterStatus = 'selected';
						}
					});
				});
			}

			var selectedRoles = $scope.filters.role.filter(function(role) {
				return role.selected;
			});

			if(selectedRoles.length) {
				selectedRoles = selectedRoles.map(function(role) {
					return role.name;
				});

				ng.forEach(vm.tables, function(table) {
					ng.forEach(table.seats, function(seat) {
						if(seat.employee && (selectedRoles.indexOf(seat.employee.role) > -1)) {
							seat.filterStatus = 'selected';
						}
					});
				});
			}

		}, true);

		// fetch config
	    fetchConfig();
	}

})(angular);