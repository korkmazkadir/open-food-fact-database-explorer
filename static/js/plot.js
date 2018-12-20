
const scatterPlotMatrix = new ScatterPlotMatrix("chart-container",850,650);
scatterPlotMatrix.plotAll();

function initializePlotPage(data,categoryName){
  console.log("Data is : " + data.length);
  scatterPlotMatrix.plot(1,data,"carbohydrates_100g","energy_100g");
  scatterPlotMatrix.plot(2,data,"proteins_100g","energy_100g");
  scatterPlotMatrix.plot(3,data,"fat_100g","energy_100g");
  scatterPlotMatrix.plot(4,data,"fiber_100g","energy_100g");
  var elementCategoryName = document.getElementById("category-name");
  elementCategoryName.innerHTML = categoryName;
}


var app = angular.module("myApp", ["rzModule"]);
app.controller("myCtrl", function($scope,$window) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";

    $scope.slider1 = {
    min: 10,
    max: 500,
    options: {
        id : "slider-y",
        floor: 10,
        ceil: 500,
        vertical: true
      }
    };

    $scope.slider2 = {
    min: 10,
    max: 500,
    options: {
        id : "slider-x",
        floor: 10,
        ceil: 500,
        vertical: false
      }
    };

    $scope.resetPlot = function(){
      console.log("Reset Working :) ");
      const child = $window.open('https://www.google.com', '_blank');
      console.log("Child object : " + Object.keys(child));
    };

    $scope.testFunction = function(message){
      console.log("Message : " + message);
    }

});

window.onload = function () {
    angular.element(document.getElementById('app-container')).scope().testFunction('Hello There');
}
