/*  Rhythnic www.rhythnic.com
 *  angular-rh-icon.js
 *  Directives for angular-rh-icon
*/

angular.module('rhIcon', [])

// This directive should be used just after the opening body tag
// It constructs a symbol with an id for each icon
.directive('rhSymbols', ['rhIconList', '$log',
    function (rhIconList, $log) {
        var template = ['<defs>'];
        angular.forEach(rhIconList, function (value, id) {
            template.push('<symbol viewBox="' + value.vb +
                '" id="' + id + '"><path d="' + value.path + '"/></symbol>');

        });
        template.push('</defs>');

        return {
            restrict: 'A',
            template: template.join(''),
            compile: function compile(iElement, tAttrs) {
                return {
                    pre: function (scope, iElement, iAttrs) {
                        iElement.attr('style', 'display:none;');
                    }
                };
            }
        };
}])

// This directive should be used wherever you want the icon to display
// Use the directive as a attribute on an SVG tag and identify the icon with the icon attribute
.directive('rhIcon', ['rhIconList',
    function (rhIconList) {
        return {
            restrict: 'A',
            scope: {
                icon: '@icon',
                title: '@title'
            },
            template: '<use xlink:href=""><title>{{title}}</title></use>',
            compile: function compile(iElement, tAttrs) {
                return {
                    pre: function (scope, iElement, iAttrs) {
                        var use = iElement.find('use');
                        use.attr('xlink:href', '#' + scope.icon);
                    }
                };
            }
        };
}]);