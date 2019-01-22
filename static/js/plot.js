
var app = angular.module("myApp", ["rzModule"]);
app.controller("myCtrl", function($scope,$window,$timeout) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";

    $scope.sliderX = {
    min: 10,
    max: 500,
    options: {
        id : "slider-x",
        floor: 10,
        ceil: 500,
        vertical: false,
        onEnd: filterY
      }
    };


    $scope.sliderY = {
    min: 10,
    max: 500,
    options: {
        id : "slider-y",
        floor: 10,
        ceil: 500,
        vertical: true,
        onEnd: filterX
      }
    };


    $scope.resetPlot = function(){
      console.log("Reset!");

      visibilityPredicates = {};

      $scope.columns.forEach((c)=>{
        if(c.isChanged === true){
          c.sliderMin = c.min;
          c.sliderMax = c.max;
          updatePlots(c);
          c.isChanged = false;
        }
      })

      $scope.sliderX.min = $scope.columnX.sliderMin;
      $scope.sliderX.max = $scope.columnX.sliderMax;
      $scope.sliderY.min = $scope.columnY.sliderMin;
      $scope.sliderY.max = $scope.columnY.sliderMax;

    };


    var updatedPlots = [];
    function updateDotVisibilities(){
      for(var i = 1; i < 5; i++ ){
        if(updatedPlots.indexOf(i) === -1){
          console.log("Udpateing plot : " + i);
          scatterPlotMatrix.updateDotVisibilities(i);
        }
      }
      updatedPlots = [];
    }

    function updatePlots(changedColumn){

      for(var i = 1; i < 5; i++ ){
        const axis = plotAxises["plot"+i];

        scatterPlotMatrix.setVisibilityPredicates(i,visibilityPredicates);

        if(axis.x === changedColumn.name){
          updatedPlots.push(i);
          scatterPlotMatrix.updatePlotXAxis(
            i,
            changedColumn.sliderMin,
            changedColumn.sliderMax
          );
        }else if(axis.y === changedColumn.name){
          updatedPlots.push(i);
          scatterPlotMatrix.updatePlotYAxis(
            i,
            changedColumn.sliderMin,
            changedColumn.sliderMax
          );
        }

      }
      updateDotVisibilities();
    }


    var visibilityPredicates = {};

    function addVisibilityPredicate(columnName, min, max){
      console.log("Adding predicate : " + columnName);
      visibilityPredicates[columnName] = function(product){
           if(product[columnName] >= min && product[columnName] <= max){
             return true;
           }
           return false;
      };
    }


    function filterY(){
      if($scope.columnX){
        $scope.columnX.sliderMin = $scope.sliderX.min;
        $scope.columnX.sliderMax = $scope.sliderX.max;
        addVisibilityPredicate($scope.columnX.name, $scope.columnX.sliderMin, $scope.columnX.sliderMax );
        updatePlots($scope.columnX);
        $scope.columnX.isChanged = true;
      }
    }

    function filterX(){
      if($scope.columnY){
        $scope.columnY.sliderMin = $scope.sliderY.min;
        $scope.columnY.sliderMax = $scope.sliderY.max;
        addVisibilityPredicate($scope.columnY.name, $scope.columnY.sliderMin, $scope.columnY.sliderMax );
        updatePlots($scope.columnY);
        $scope.columnY.isChanged = true;
      }
    }


    function findColumnByName(columnName){
      return $scope.columns.find(c=>{
        return c.name === columnName;
      });
    }

    $scope.columnX;
    $scope.columnY;
    function setSliderValues(plotIndex){
      const xAxisName = plotAxises["plot"+plotIndex].x;
      const yAxisName = plotAxises["plot"+plotIndex].y;

      console.log( xAxisName + " -- " + yAxisName)

      const columnX = findColumnByName(xAxisName);
      const columnY = findColumnByName(yAxisName);

      $scope.columnX = columnX;
      $scope.columnY = columnY;

      $timeout(()=>{
        $scope.sliderX.options.floor = columnX.sliderFloor;
        $scope.sliderX.options.ceil = columnX.sliderCeil;
        $scope.sliderX.min = columnX.sliderMin;
        $scope.sliderX.max = columnX.sliderMax;

        $scope.sliderY.options.floor = columnY.sliderFloor;
        $scope.sliderY.options.ceil = columnY.sliderCeil;
        $scope.sliderY.min = columnY.sliderMin;
        $scope.sliderY.max = columnY.sliderMax;
      });

    }

    $scope.selectedPlotIndex;
    $scope.plotSelected = function(plotIndex){
      $scope.selectedPlotIndex = plotIndex;
      console.log("==> Selected Plot : " + plotIndex);
      setSliderValues(plotIndex);
    };

    const scatterPlotMatrix = new ScatterPlotMatrix("chart-container",850,650);
    var productList;
    var plotAxises = {};
    $scope.initializePlotPage = function(data,categoryName, columns){
      productList = data;

      columns.forEach((c)=>{
        c.sliderMin = c.min;
        c.sliderMax = c.max;
        c.sliderFloor = c.min;
        c.sliderCeil = c.max;
        c.isChanged = false;
      })

      productList.forEach((p)=>{
        p.isVisible = true;
      });

      $scope.columns = columns;

      console.log(JSON.stringify(columns));

      console.log("Data is : " + data.length);
      scatterPlotMatrix.plot(1,data.slice(),"carbohydrates_100g","energy_100g");
      scatterPlotMatrix.plot(2,data.slice(),"proteins_100g","energy_100g");
      scatterPlotMatrix.plot(3,data.slice(),"fat_100g","energy_100g");
      scatterPlotMatrix.plot(4,data.slice(),"fiber_100g","energy_100g");
      scatterPlotMatrix.setPlotSelectedEventListener($scope.plotSelected);
      var elementCategoryName = document.getElementById("category-name");
      elementCategoryName.innerHTML = categoryName;

      plotAxises.plot1 = { x : "carbohydrates_100g", y : "energy_100g"}
      plotAxises.plot2 = { x : "proteins_100g", y : "energy_100g"}
      plotAxises.plot3 = { x : "fat_100g", y : "energy_100g"}
      plotAxises.plot4 = { x : "fiber_100g", y : "energy_100g"}
    }


    $window.initializePlotPage = $scope.initializePlotPage;

});
