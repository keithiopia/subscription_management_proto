(function(){

  var app = angular.module("emailPrototype", []);

  app.filter("replaceDashes", function(){
    return function(input){
      input = input || '';
      return input.replace(/-/g, function(character){ return character.replace("-", " ")});
    }
  })

  app.filter("replacePluses", function(){
    return function(input){
      input = input || '';
      return input.replace(/\+/g, function(character){ return character.replace("+", " ")});
    }
  })

  app.filter("titleCase", function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  })

  app.factory("Parameters", ["$rootScope", "$filter", function($rootScope, $filter){

    function Parameters(){}

    Parameters.originalQueryString = function(){
      paramsString = window.location.search;
      queryString = paramsString.split("?")[1];
      return queryString;
    }

    Parameters.parse = function(){
      if(Parameters.originalQueryString())
        return JSON.parse('{"' + decodeURI(Parameters.originalQueryString()).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
      else
        return {}
    }

    Parameters.populate = function(){
      params = Parameters.parse();
      $rootScope.documentType = $filter("replaceDashes")(params.filter_government_document_supertype) || "publications";
      $rootScope.topic = $filter("replaceDashes")(params["filter_policy_areas[]"]);
      $rootScope.department = $filter("replaceDashes")(params["filter_organisations[]"]);
      $rootScope.world_location = params["filter_world_locations[]"];
      $rootScope.total = params["total"];
      $rootScope.searchTerms = params["q"];
      $rootScope.frequency = params["frequency"];
    }

    Parameters.nextLinkQueryString = function(){
      qs = Parameters.originalQueryString();
      angular.forEach(Parameters.newParameterPairs, function(value, key){
        newParam = "&" + key + "=" + value;
        qs += newParam
      });
      return qs;
    }

    Parameters.newParameterPairs = {};

    Parameters.addParameter = function(name, value){
      Parameters.newParameterPairs[name] = value;
    }

    return Parameters;
  }]);

  app.controller("filtersController", ["$scope", "$rootScope", "Parameters", function($scope, $rootScope, Parameters){
    function hasValue(model){
      return model != "" &&
        model != undefined &&
        model != "all";
    }

    Parameters.populate();

    $scope.selectedFilters = [];
    $scope.buildSelectedFilters = function(){
      $scope.selectedFilters = [];
      if(hasValue($rootScope.documentType))
        $scope.selectedFilters.push({"title" : "Document type", "value" : $rootScope.documentType});
      if(hasValue($rootScope.topic))
        $scope.selectedFilters.push({"title" : "Policy area", "value" : $rootScope.topic});
      if(hasValue($rootScope.department))
        $scope.selectedFilters.push({"title" : "Department", "value" : $rootScope.department});
      if(hasValue($rootScope.world_location))
        $scope.selectedFilters.push({"title" : "World location", "value" : $rootScope.world_location});
    };
    $scope.buildSelectedFilters();

    $scope.returnLinkQueryString = Parameters.nextLinkQueryString();

    $scope.calculateUpdateCount = function(){
      if($scope.total == 0)
        $scope.updateCount = 0;
      else
        $scope.updateCount = Math.round($scope.total/52);

      $scope.dailyCount = $scope.updateCount;
      $scope.dailyDigestCount = $scope.updateCount;
      $scope.weeklyDigestCount = $scope.updateCount * 7;
    };

    $scope.calculateUpdateCount();

    $scope.addFrequencyParameter = function(value){
      Parameters.addParameter("frequency", value);
      $rootScope.frequency = value;
      $scope.returnLinkQueryString = Parameters.nextLinkQueryString();
      $scope.updateFrequencyText();
    }

    $scope.frequencyText = "";
    $scope.updateFrequencyText = function(){
      if($rootScope.frequency == "immediately")
        $scope.frequencyText = "as soon as changes are published";
      if($rootScope.frequency == "daily")
        $scope.frequencyText = "One daily email (if something changes)";
      if($rootScope.frequency == "weekly")
        $scope.frequencyText = "One weekly email (if something changes)";
    }
    $scope.updateFrequencyText();
  }]);
})();
