/*  Rhythnic www.rhythnic.com
 *  angular-rh-icon.js
 *  Directives for angular-rh-icon
 */

angular.module('rh.icon', [])

//angular provider - downloads icons and provides access functions
.provider('rhIconCollection', function rhIconCollectionProvider() {
    //path to json file with icon information; path is from web root directory
    var filePath;
    
    this.setFilePath = function (value) {
        filePath = value;
    };
    
    this.$get = ['$http', '$q', '$log', function rhIconCollectionFactory($http, $q, $log) {
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

//allows the use of data-binding for viewbox in the templates
.directive('ngViewbox', function() {
    return function(scope, element, attrs) {
        attrs.$observe('ngViewbox', function(value) {
            element.attr('viewBox', value);
        });
    };
})

//allows the use of data-binding for path's d attribute in the templates
.directive('ngD', function() {
    return function(scope, element, attrs) {
        attrs.$observe('ngD', function(value) {
            element.attr('d', value);
        });
    };
})


// This directive should be used just after the opening body tag
// It constructs a symbol with an id and viewBox for each icon
.directive('rhDef', function () {
    return {
        restrict: 'EA',
        replace: true,
        template: ['<svg style="display:none"><defs><symbol ng-repeat="id in iconIds"',
                   'ng-viewbox="{{getViewBox(icons[id])}}"',
                   'id="{{id}}"><path ng-d="{{icons[id].path}}" /></symbol></defs></svg>'].join(''),
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

// This directive is used where the icon should be displayed
.directive('rhIcon', ['$log', function ($log) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                icon: '@icon',
                title: '@title'
            },
            template: '<svg ng-viewbox="{{vb}}"><use xlink:href=""><title>{{title}}</title></use></svg>',
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