/**
 * Inline SVG icons for angular
 * version 0.0.11
 * @link https://bitbucket.org/rhythnic
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function (window, angular, undefined) {
/*jshint globalstrict:true*/
/*global angular:false*/
'use strict';

/**
 * @ngdoc overview
 * @name rh.icon
 *
 * @description
 * # rh.icon
 * 
 * ## The main module for rh.icon
 * Only this module is needed as a dependency within your angular app.
 * 
 * <pre>
 * <!doctype html>
 * <html ng-app="myApp">
 * <head>
 *   <script src="js/angular.js"></script>
 *   <!-- Include the rh-icon script -->
 *   <script src="js/angular-rh-icon.min.js"></script>
 *   <script>
 *     // ...and add 'rh.icon' as a dependency
 *     var myApp = angular.module('myApp', ['rh.icon']);
 *   </script>
 * </head>
 * <body>
 * </body>
 * </html>
 * </pre>
 */
angular.module('rh.icon', [])

/**
 * @ngdoc object
 * @name rh.icon.rhIconCollection
 * @name ui.router.state.$stateProvider
 *
 * @requires $http
 *
 * @description
 * The rhIconCollectionFactory downloads and stores the icon list, which is a json file.
 * It requires setting the path to the json file in your app.config method.
 * The path is from the root web directory
 *
 *     myapp.config(['rhIconListProvider', function (rhIconListProvider) {
 *        rhIconListProvider.setFilePath('json/icons.json');
 *
 * This servie, rhIconCollection, then communicates with the rh.icon directives to provide
 * the necessary information to construct the svg tags for the icons.  When the rh-icon directive
 * is used in the template, the directive registers the icon's use with rhIconCollection.  The
 * controller for the rh-def directive watches the rhIconCollection.getIconIDs function.  When it
 * sees that a new icon has been registered, it adds an svg symbol definition for that icon.
 * An array of all available icon names can be obtained by calling rhIconCollection.getAvailableIconIDs.
 */
.provider('rhIconCollection', function rhIconCollectionProvider() {
    var filePath;
    
    this.setFilePath = function (value) {
        filePath = value;
    };
    
    this.$get = ['$http', function rhIconCollectionFactory($http) {
        var icons = {},
            iconIDs = [],
            promise = $http({ method: 'GET', url: filePath, cache: true });
        
        return {
            registerIcon: function(iconID){
                return promise.then(function(res){
                    if (!(iconID in icons)) {
                        icons[iconID] = res.data[iconID];
                        iconIDs.push(iconID);
                    }
                    return res.data[iconID];
                });
            },
            getIcons: function() {
                return icons;
            },
            getIconIDs: function() {
                return iconIDs;
            },
            getAvailableIconIDs: function() {
                return promise.then(function(res){
                    return Object.keys(res.data);
                });
            }
        };
  }];
})

/**
 * @ngdoc directive
 * @name rh.icon.directive:rhViewbox
 *
 * @description
 * Angular throws an error when binding a scope variable to the viewBox attribute.
 * This directive allows you bind a scope value to the viewBox attribute
 * This directive is used internally and is not part of rh.icon's interface.
 *
 * example:
 * <svg rh-viewbox="{{icon.viewbox}}"></svg>
 */
.directive('rhViewbox', function() {
    return function(scope, element, attrs) {
        attrs.$observe('rhViewbox', function(value) {
            element.attr('viewBox', value);
        });
    };
})

/**
 * @ngdoc directive
 * @name rh.icon.directive:rhD
 *
 * @description
 * Angular throws an error when binding a scope variable to the d attribute of a path element.
 * This directive allows you bind a scope value to the d attribute
 * This directive is used internally and is not part of rh.icon's interface.
 *
 * example:
 * <path rh-d="{{icon.path}}"></path>
 */
.directive('rhD', function() {
    return function(scope, element, attrs) {
        attrs.$observe('rhD', function(value) {
            element.attr('d', value);
        });
    };
})


/**
 * @ngdoc directive
 * @name rh.icon.directive:rhDef
 *
 * @description
 * This directive creates all of the symbol definitions for all icons used in the template.
 * This allows you to use each icon multiple times while only defining it once.
 * Place this directive soon after the opening body tag.
 *
 * example:
 * <body>
 * <rh-def></rh-def>
 *
 * result:
 * <svg>
 *     <def>
 *         <symbol viewBox="8 7 15 15" id="phone">
 *             <path d="..."></path>
 *         </symbol>
 *         ... (etc. - one symbol for each type of icon)
 *     </def>
 * </svg>
 */
.directive('rhDef', function () {
    return {
        restrict: 'EA',
        replace: true,
        template: ['<svg style="display:none"><defs><symbol ng-repeat="id in iconIds"',
                   'rh-viewbox="{{getViewBox(icons[id])}}"',
                   'id="{{id}}"><path rh-d="{{icons[id].path}}" /></symbol></defs></svg>'].join(''),
        scope: {},
        controller: ['$scope', '$log', 'rhIconCollection', function ($scope, $log, rhIconCollection) {
            $scope.getViewBox = function(icon) {
                return [icon.x, icon.y, icon.w, icon.h].join(' ');
            };
            $scope.$watch(rhIconCollection.getIconIDs, function(oldVal, newVal){
                $scope.icons = rhIconCollection.getIcons();
                $scope.iconIds = newVal;
            });
        }]
    };
})

/**
 * @ngdoc directive
 * @name rh.icon.directive:rhIcon
 *
 * @description
 * This directive is placed in the template where the icon should be displayed.
 * Use the icon attribute to specify the icon id
 * Use the title attribute to specify an svg title
 *
 * example:
 * <rh-icon icon="rh-gear" title="Settings"></rh-icon>
 *
 * result:
 * <svg viewBox="0 0 15 15">
 *     <use xlink:href="#rh-gear">
 *         <title>Settings</title>
 *     </use>
 * </svg>
 */
.directive('rhIcon', ['$log', function ($log) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                icon: '@icon',
                title: '@title'
            },
            template: '<svg rh-viewbox="{{vb}}"><use xlink:href=""><title>{{title}}</title></use></svg>',
            controller: ['$scope', '$log', 'rhIconCollection', function ($scope, $log, rhIconCollection) {
                rhIconCollection.registerIcon($scope.icon).then(function (res) {
                    $scope.vb = [0, 0, res.w, res.h].join(' ');
                });
            }],
            compile: function compile(iElement, tAttrs) {
                return {
                    pre: function (scope, iElement) {
                        iElement.find('use').attr('xlink:href', '#' + scope.icon);
                    }
                };
            }
        };
}]);
    
}(window, angular, undefined));