angular.module('rhIcon', [])

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

.directive('rhIcon', ['rhIconList',
    function (rhIconList) {
        return {
            restrict: 'AC',
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