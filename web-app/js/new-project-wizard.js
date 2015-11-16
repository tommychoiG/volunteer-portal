function createProjectModule(config) {
  'use strict';

  /* generated by babeljs.io */
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var LonLat = function LonLat() {
    var latitude = arguments.length <= 0 || arguments[0] === undefined ? -27.76133033947936 : arguments[0];
    var longitude = arguments.length <= 1 || arguments[1] === undefined ? 134.47265649999997 : arguments[1];

    _classCallCheck(this, LonLat);

    this.latitude = latitude;
    this.longitude = longitude;
  };

  var Map = function Map() {
    var zoom = arguments.length <= 0 || arguments[0] === undefined ? 3 : arguments[0];
    var centre = arguments.length <= 1 || arguments[1] === undefined ? new LonLat() : arguments[1];

    _classCallCheck(this, Map);

    this.zoom = zoom;
    this.centre = centre;
  };

  var Institution = function Institution() {
    var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var name = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    _classCallCheck(this, Institution);

    this.id = id;
    this.name = name;
  };

  var ProjectDefintion = function ProjectDefintion(stagingId) {
    var featuredOwner = arguments.length <= 1 || arguments[1] === undefined ? new Institution() : arguments[1];
    var name = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
    var shortDescription = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];
    var longDescription = arguments.length <= 4 || arguments[4] === undefined ? '' : arguments[4];
    var templateId = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];
    var projectTypeId = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];
    var imageUrl = arguments.length <= 7 || arguments[7] === undefined ? '' : arguments[7];
    var imageCopyright = arguments.length <= 8 || arguments[8] === undefined ? '' : arguments[8];
    var showMap = arguments.length <= 9 || arguments[9] === undefined ? false : arguments[9];
    var map = arguments.length <= 10 || arguments[10] === undefined ? new Map() : arguments[10];
    var picklistId = arguments.length <= 11 || arguments[11] === undefined ? null : arguments[11];
    var labelIds = arguments.length <= 12 || arguments[12] === undefined ? [] : arguments[12];

    _classCallCheck(this, ProjectDefintion);

    this.featuredOwner = featuredOwner;
    this.stagingId = stagingId;
    this.name = name;
    this.shortDescription = shortDescription;
    this.longDescription = longDescription;
    this.templateId = templateId;
    this.projectTypeId = projectTypeId;
    this.imageUrl = imageUrl;
    this.imageCopyright = imageCopyright;
    this.showMap = showMap;
    this.map = map;

    this.picklistId = picklistId;
    this.labelIds = labelIds;
  };
  /* end generated */


  function findLabelWithId(labels, id) {
    return _.find(labels, function(label) { return label.id == id; });
  }

  var findConfigLabelWithId = _.partial(findLabelWithId, config.labels);

  var wizard = angular.module('projectWizard', ['ui.router', 'qtip2', 'uiGmapgoogle-maps', 'ngFileUpload', 'ui.bootstrap.showErrors']);
  wizard.constant('stagingId', config.stagingId);

  wizard.config([
    '$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', 'showErrorsConfigProvider',
    function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, showErrorsConfigProvider) {
      $stateProvider
        .state('start', {
          url: '/',
          templateUrl: 'start.html',
          data: {
            next: 'institutions',
            title: 'Welcome'
          }
        })
        .state('institutions', {
          url: '/institutions',
          controller: 'InstitutionCtrl',
          templateUrl: 'institution-details.html',
          data: {
            next: 'details',
            prev: 'start',
            title: 'Expedition institution'
          }
        })
        .state('details', {
          url: '/details',
          controller: 'DetailsCtrl',
          templateUrl: 'project-details.html',
          data: {
            next: 'image',
            prev: 'institutions',
            title: 'Details'
          }
        })
        .state('image', {
          url: '/image',
          controller: 'ImageCtrl',
          templateUrl: 'image.html',
          data: {
            next: 'map',
            prev: 'details',
            title: 'Expedition image'
          }
        })
        .state('map', {
          url: '/map',
          controller: 'MapCtrl',
          templateUrl: 'map.html',
          data: {
            next: 'extras',
            prev: 'image',
            title: 'Map Options'
          }
        })
        .state('extras', {
          url: '/extras',
          controller: 'ExtrasCtrl',
          templateUrl: 'extras.html',
          data: {
            next: 'summary',
            prev: 'map',
            title: 'Details'
          }
        })
        .state('summary', {
          url: '/summary',
          controller: 'SummaryCtrl',
          templateUrl: 'summary.html',
          data: {
            prev: 'extras',
            title: 'Expedition Summary'
          }
        })
        .state('failed', {
          url: '/failed',
          templateUrl: 'failed.html',
          data: {
            title: 'Project Creation Failed'
          }
        })
        .state('success', {
          url: '/success',
          templateUrl: 'success.html',
          controller: 'SuccessCtrl',
          data: {
            title: 'Project Created'
          },
          params: {
            id: null
          }
        });

      $urlRouterProvider.otherwise('/');

      showErrorsConfigProvider.showSuccess(true);

    }
  ]);

  wizard.factory('project', ['stagingId', function(stagingId) {
    var project = new ProjectDefintion(stagingId);
    var autosave = config.autosave ? angular.fromJson(config.autosave) : null;
    if (autosave) angular.extend(project, autosave);
    if (config.projectImageUrl) project.imageUrl = config.projectImageUrl;
    return project;
  }]);
  wizard.run([
    '$http', '$rootScope', '$window', '$state', '$log', '$location', '$timeout', '$uiViewScroll', 'project',
    function ($http, $rootScope, $window, $state, $log, $location, $timeout, $uiViewScroll, project) {

      $rootScope.project = project;
      $rootScope.$state = $state;

      // Scroll to top of page when state changes
      $rootScope.$on('$viewContentLoaded', function () {
        $timeout(performAutoScroll, 0);
      });


      function performAutoScroll () {
        var hash = $location.hash();
        var element =
            findDomElement('#' + hash)
            || findDomElement('a[name="' + hash + '"]')
            || angular.element(window.document.body)
          ;
        $uiViewScroll(element);
      }

      /**
       * @param {string} selector
       * @returns {jQuery|null}
       */
      function findDomElement (selector) {
        var result = $(selector);
        return (result.length > 0 ? result : null);
      }

      $rootScope.$on("$stateChangeError", console.log.bind(console));

      $rootScope.back = function () {
        $http.post(config.autosaveUrl, project);
        $state.go($state.current.data.prev, {}, { location: 'replace' });
      };

      $rootScope.continue = function () {
        $http.post(config.autosaveUrl, project);
        $state.go($state.current.data.next, {}, { location: 'replace' });
      };

      $rootScope.cancel = function () {
        $window.location.href = config.cancelUrl;
      };

      $rootScope.$watch('project', function(newVal,oldVal,scope) {
        $http.post(config.autosaveUrl, newVal);
      }, true);

      // if no autosave, force to start state
      if (config.autosave == null) {
        $state.go('start', {}, { location: 'replace' });
      }
    }]);
  wizard.controller('InstitutionCtrl', [
    '$scope', '$log', 'project',
    function ($scope, $log, project) {
      // Instantiate the bloodhound suggestion engine
      var bh = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        identify: function (obj) {
          return obj.name;
        },
        local: config.institutions
      });

      // initialize the bloodhound suggestion engine
      bh.initialize();

      // Typeahead options object
      $scope.options = {
        highlight: true,
        minLength: 2
      };

      // Single dataset example
      $scope.data = {
        displayKey: 'name',
        source: bh.ttAdapter()
      };

      $scope.project = project;

      $scope.institutionSelect = function(event, suggestion) {
        //$scope.$apply(function () {
          var featuredOwner = {
            id: null,
            name: ''
          };
          if (_.isString(suggestion)) {
            var data = bh.get([suggestion]);

            if (data.length == 1) {
              featuredOwner.id = data[0].id;
              featuredOwner.name = data[0].name;
            } else {
              featuredOwner.name = suggestion;
            }
          } else {
            featuredOwner.id = suggestion.id;
            featuredOwner.name = suggestion.name;
          }
          $scope.project.featuredOwner.id = featuredOwner.id;
          $scope.project.featuredOwner.name = featuredOwner.name;
        //});
      };
    }
  ]);
  wizard.controller('DetailsCtrl', [
    '$scope', 'project',
    function ($scope, project) {
      $scope.project = project;
    }
  ]);

  wizard.controller('ImageCtrl', [
    '$scope', 'project', 'Upload', '$http',
    function ($scope, project, Upload, $http) {
      $scope.project = project;

      $scope.progress = 0;

      $scope.upload = function (file) {
        if (!file) return;
        $scope.project.imageUrl = null;
        Upload.upload({
          url: config.imageUploadUrl,
          data: {featuredImage: file}
        }).then(function (resp) {
          var cb = Math.random();
          $scope.project.imageUrl = resp.data.projectImageUrl + '?cb='+cb;
          var filename = (file || {}).name || '';
          console.log('Success ' + filename + 'uploaded. Response: ' + resp.data);
          $scope.progress = 0;
        }, function (resp) {
          console.log('Error status: ' + resp.status);
          $scope.progress = 0;
        }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          var filename = (evt.config.data.featuredImage || {}).name || '';
          console.log('progress: ' + progressPercentage + '% ' + filename);
          $scope.progress = progressPercentage;
        });
      };

      $scope.clearImage = function () {
        $http.post(config.imageClearUrl).then(function(response) { $scope.project.imageUrl = null; });
      };
    }
  ]);
  wizard.controller('MapCtrl', [
    '$scope', 'project',
    function($scope, project) {
      $scope.project = project;

      $scope.mapStyle = function() {
        return $scope.project.showMap ? { 'opacity' : 1.0} : { 'opacity': 0.2 };
      }
    }
  ]);
  wizard.controller('ExtrasCtrl', [
    '$scope', 'project', '$timeout',
    function($scope, project, $timeout) {
      $scope.project = project;

      var bh = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace(['category', 'value']),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        identify: function (obj) {
          return obj.category + ":" + obj.value;
        },
        local: config.labels
      });

      // initialize the bloodhound suggestion engine
      bh.initialize();

      // Typeahead options object
      $scope.options = {
        highlight: true,
        minLength: 2
      };

      $scope.data = {
        displayKey: function(label) {
          return label.value + " (" + label.category + ")";
        },
        source: bh.ttAdapter()
      };

      $scope.labels = project.labelIds.map(findConfigLabelWithId); // O(mn) but do we care?

      $scope.labelAutocomplete = '';

      $scope.selectLabel = function(event, suggestion) {
        $scope.addLabel(suggestion);
        $timeout(function() { $scope.labelAutocomplete = ''; }, 32); // 2fps at 60hz
      };

      $scope.addLabel = function(l) {
        $scope.labels.push(l);
        if (project.labelIds.indexOf(l.id) < 0) project.labelIds.push(l.id);
      };

      $scope.removeLabel = function(l) {
        $scope.labels.splice($scope.labels.indexOf(l), 1);
        var labelIdx = project.labelIds.indexOf(l.id);
        if (labelIdx < 0) project.labelIds.splice(labelIdx, 1);
      };
    }
  ]);
  wizard.controller('SummaryCtrl', [
    '$scope', 'project','$http', '$state',
    function($scope, project, $http, $state) {
      $scope.project = project;

      $scope.labels = project.labelIds.map(findConfigLabelWithId); // O(mn) but do we care?

      $scope.mapOptions = {
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        draggable: false,
        keyboardShortcuts: false,
        panControl: false,
        rotateControl: false,
        scaleControl: false,
        scrollwheel: false,
        streetViewControl: false,
        zoomControl: false
      };

      $scope.projectTypeImageUrl = function() {
        //$scope.project.projectTypeLabel
        return null;
      };

      $scope.projectTemplate = _.find(config.templates, function(t) {
          return t.id == project.templateId;
        });

      $scope.projectType = _.find(config.projectTypes, function(t) {
          return t.id == project.projectTypeId;
        });

      $scope.loading = false;
      $scope.create = function() {
        $scope.loading = true;
        $http.post(config.createUrl, project).then(
          function(resp) {
            $scope.loading = false;
            $state.go('success', {id: resp.data.id}, { location: false });
          },
          function (resp) {
            $scope.loading = false;
            $state.go('failed', {}, { location: false });
          }
        );
      }
    }
  ]);

  wizard.controller('SuccessCtrl', [
    '$scope', '$state',
    function($scope, $state) {
      $scope.projectId = $state.params.id;
    }]);

  wizard.directive('dvProjectname', [
    "$q","$http",
    function($q, $http) {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {

        ctrl.$asyncValidators.projectname = function(modelValue, viewValue) {

          if (ctrl.$isEmpty(modelValue)) {
            // consider empty model valid
            return $q.when();
          }

          var def = $q.defer();

          $http.get(config.projectNameValidatorUrl, {
            params: {
              'name': modelValue
            },
            headers: {
              'Accept': 'application/json'
            }
          }).then(
            function success(response) {
              if (response.data.count == 0) def.resolve();
              else def.reject();
            },
            function error(response) {
              console.debug("Got error response from name checker", response);
              def.reject();
            }
          );

          return def.promise;
        };
      }
    };
  }]);

  wizard.directive('dvConvertToNumber', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(val) {
          return parseInt(val, 10);
        });
        ngModel.$formatters.push(function(val) {
          return '' + val;
        });
      }
    };
  });

  wizard.directive('dvLabel',
    function() {
    return {
      restrict: 'E',
      scope: {
        label: '=',
        remove: '&onRemove'
      },
      templateUrl: 'label.html',
      link: function(scope, elm, attrs, ctrl) {
        scope.hasRemove = attrs.onRemove != null;
        scope.colour = function() {
          return config.labelColourMap[scope.label.category];
        };
      }
    };
  });

  wizard.directive('dvTypeahead', ['$parse', function ($parse) {
    return {
      restrict: 'A',       // Only apply on an attribute or class
      //require: '?ngModel',  // The two-way data bound value that is returned by the directive
      scope: {
        'options': '=taOptions',       // The typeahead configuration options (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#options)
        'datasets': '=taDatasets'      // The typeahead datasets to use (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#datasets)
      },
      link: function (scope, element, attrs, ngModel) {
        var options = attrs.taOptions || {},
          datasets = (angular.isArray(attrs.taDatasets) ? attrs.taDatasets : [attrs.taDatasets]) || [], // normalize to array
          init = true;

        // Create the typeahead on the element
        initialize();

        scope.$watch('options', initialize);

        if (angular.isArray(scope.datasets)) {
          scope.$watchCollection('datasets', initialize);
        }
        else {
          scope.$watch('datasets', initialize);
        }

        function initialize() {
          if (init) {
            element.typeahead(scope.options, scope.datasets);
            init = false;
          } else {
            // If datasets or options change, hang onto user input until we reinitialize
            var value = element.val();
            element.typeahead('destroy');
            element.typeahead(scope.options, scope.datasets);
            //ngModel.$setViewValue(value);
            element.triggerHandler('typeahead:open');
          }
        }

        var customEventPrefix = 'typeahead:';
        var cepLength = customEventPrefix.length;
        var customEvents = [
          'active',
          'idle',
          'open',
          'close',
          'change',
          'render',
          'select',
          'autocomplete',
          'cursorchange',
          'asyncrequest',
          'asynccancel',
          'asyncreceive'
        ];

        var events = {
          active: attrs.taActive ? $parse(attrs.taActive) : null,
          idle: attrs.taIdle ? $parse(attrs.taIdle) : null,
          open: attrs.taOpen ? $parse(attrs.taOpen) : null,
          close: attrs.taClose ? $parse(attrs.taClose) : null,
          change: attrs.taChange ? $parse(attrs.taChange) : null,
          render: attrs.taRender ? $parse(attrs.taRender) : null,
          select: attrs.taSelect ? $parse(attrs.taSelect) : null,
          autocomplete: attrs.taAutocomplete ? $parse(attrs.taAutocomplete) : null,
          cursorchange: attrs.taCursorchange ? $parse(attrs.taCursorchange) : null,
          asyncrequest: attrs.taAsyncrequest ? $parse(attrs.taAsyncrequest) : null,
          asynccancel: attrs.taAsynccancel ? $parse(attrs.taAsynccancel) : null,
          asyncreceive: attrs.taAsyncreceive ? $parse(attrs.taAsyncreceive) : null
        };

        var allEvents = customEvents.map(function(t) { return customEventPrefix + t; }).join(' ');

        element.bind(allEvents, function(event) {
          //var args = new Array(arguments.length+1);
          ////args[0] = event.type;
          //for(var i = 0; i < arguments.length; ++i) {
          //  //i is always valid index in the arguments object
          //  args[i+1] = arguments[i];
          //}
          //((events[event.type.slice(cepLength)] || angular.noop)() || angular.noop).apply(this, arguments);
          //scope.$emit.apply(scope, args);
          var name = event.type.slice(cepLength);
          var handler = events[name];
          if (handler) {
            var suggestion = arguments[1];
            scope.$parent.$apply(function() { handler(scope.$parent, {type: name, suggestion: suggestion}) });
          }
        });
      }
    };
  }]);
}

