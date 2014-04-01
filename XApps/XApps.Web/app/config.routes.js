( function() {
	var app = angular.module('app');

	app.constant('routes', getRoutes());

	// Configure the routes and route resolvers
	app.config(['$routeProvider', 'routes', routeConfigurator]);
	function routeConfigurator($routeProvider, routes) {

		routes.forEach(function (r) {
			$routeProvider.when(r.url, r.config);
		});
		$routeProvider.otherwise({ redirectTo: '/' });
	}

	// Define the routes 
	function getRoutes() {
		return [
            {
            	url: '/',
            	config: {
            		templateUrl: 'app/dashboard/dashboard.html',
            		title: 'dashboard',
            		settings: {
            			nav: 1,
            			content: '<i class="fa fa-dashboard"></i> Dashboard'
            		}
            	}
            }, {
            	url: '/hotapps',
            	config: {
            		title: 'hotapps',
            		templateUrl: 'app/hotapps/hotapps.html',
            		settings: {
            			nav: 2,
            			content: '<i class="fa fa-lock"></i> Hot Apps'
            		}
            	}
            }, {
            	url: '/myapps',
            	config: {
            		title: 'myapps',
            		templateUrl: 'app/myapps/myapps.html',
            		settings: {
            			nav: 3,
            			content: '<i class="fa fa-lock"></i> My Apps'
            		}
            	}
            }
		];
	}
}

)();