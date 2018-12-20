
var app = angular.module("myApp", ["rzModule"]);
app.controller("myCtrl", function($scope,$window,$http,$timeout) {

    $scope.getNumber = function(num) {
      var array = [];
      for(var i = 0; i< 30; i++){
        array.push(i);
      }
        return array;
    }

    $scope.slider2 = {
    min: 10,
    max: 500,
    options: {
        id : "slider-x",
        floor: 10,
        ceil: 500,
        vertical: false,
        onEnd: createOrUpdateFilter
      }
    };


  $scope.filters = {};
  function createOrUpdateFilter(){
      $scope.filters[$scope.selectedColumn] = {
        min: $scope.slider2.min,
        max: $scope.slider2.max
      };
      $scope.selectedFilter = { min: $scope.slider2.min, max:$scope.slider2.max, column:$scope.selectedColumn};
      $timeout(calculateVisibleProductList);
      $scope.visibleProductCount = 100;
  }

  $scope.deleteFilter = function(){
    delete $scope.filters[$scope.selectedColumn];
    delete $scope.selectedFilter;
    $scope.selectedColumn = "";
    $timeout(calculateVisibleProductList);
  }

  $scope.isFilterIconVisible = function(columnName){
    if($scope.filters[columnName]){
      return true;
    }
    return false;
  }

  $scope.visibleProductList = [];
  $scope.$watch('productList', calculateVisibleProductList);
  $scope.$watch('visibleProductCount', calculateVisibleProductList);

  $scope.productCount = 0;
  var filteredProductList;
  function calculateVisibleProductList (){

      //Copys old array to new array
      filteredProductList = $scope.productList.slice();

      console.log("(Before) filters : number of products : " + filteredProductList.length);

      $scope.columns.forEach((column)=>{
        if($scope.filters[column.name] && column.isVisible){

          filteredProductList = filteredProductList.filter((product)=>{
            const result = product[column.name] >= $scope.filters[column.name].min && product[column.name] <= $scope.filters[column.name].max;
            //console.log($scope.filters[column.name].min + " <= " + product[column.name] + "<=" + $scope.filters[column.name].max + "Result : " + result);
            return result;
          });

          console.log("=>Applyed filter : " + column.name + " Number of products : " + filteredProductList.length);
        }
      });

      console.log("(After) filters : number of products : " + filteredProductList.length);
      $scope.productCount = filteredProductList.length;
      $scope.visibleProductList = filteredProductList.slice(0,$scope.visibleProductCount);
  }


  $scope.selectedFilter;
  function setSliderValues(columnName){
    const columnObject = $scope.columns.find(o => o.name === columnName);

    $scope.slider2.options.floor = columnObject.min;
    $scope.slider2.options.ceil = columnObject.max;

    if($scope.filters[columnName]){
      $scope.slider2.min = $scope.filters[columnName].min;
      $scope.slider2.max = $scope.filters[columnName].max;
      $scope.selectedFilter = { min: $scope.slider2.min, max:$scope.slider2.max, column:columnName};
    }else{
      $scope.slider2.min = columnObject.min;
      $scope.slider2.max = columnObject.max;
    }
  }

  $scope.selectedColumn = "";
  $scope.selectColumn = function(columnName){
    if((nonFilterableColumns.indexOf(columnName) === -1)){
      $scope.selectedColumn = columnName;
      $timeout(()=>{setSliderValues(columnName);});
    }
  }

  $scope.openProductPage = function(productCode){
    $window.open("https://world.openfoodfacts.org/product/" + productCode, '_blank');
  }

  $scope.createPlot = function(){
      const graphWindow = $window.open('./plot.html', '_blank');
      graphWindow.addEventListener('load',()=>{
          graphWindow.initializePlotPage(filteredProductList, $scope.selectedCategoryName);
      });
  }


  $scope.getColumnValue = function(product, column){
      return product[column.name];
  }

  $scope.isColumnDisabled = function (column){
      const numberOfProducts = $scope.productList.length;
      if( Math.floor(100 * column.availableRowCount / numberOfProducts) < 1){
        return true;
      }

      return false;
  }

  var messageCount = 0;
  const messageDiv = document.getElementById('message-div');
  function showProgressMessage(message){
      $timeout(function(){
          messageDiv.innerHTML = message;
          $('#message-modal').modal('toggle');
          messageCount++;
      });
  }

  function hideProgressMessage(){
    $timeout(function(){
      messageCount--;
      if(messageCount === 0){
        $('#message-modal').modal('toggle');
      }
    });
  }


  $scope.visibleProductCount = 0;
  jQuery(function($) {
      $('#table-container').on('scroll', function() {
          if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
              console.log('Product list slider end reached...');
              $timeout(function(){
                  $scope.visibleProductCount = $scope.visibleProductCount + 100;
              });
          }
      })
  });


  $scope.showColumnSelectionModal = function(){
    $('#column-selection-modal').modal('toggle');
  }


  function resetColumnMinMaxValues(columns){
    columns.forEach((column)=>{
      column.min = 9999999;
      column.max = -9999999;
    });
  }



  function calculateColumnMinMaxValue(column,product){
    if((nonFilterableColumns.indexOf(column.name) === -1)){
      const columnValue =  product[column.name];
      if(columnValue > column.max){
        column.max = columnValue;
      }else if(columnValue < column.min){
        column.min = columnValue;
      }
    }
  }

  function calculateColumnStatistics(product){

      $scope.columns.forEach((column)=>{
        const columnValue = product[column.name];
        if(columnValue){
          column.availableRowCount += 1;
        }
        calculateColumnMinMaxValue(column,product);
      });
  }

  $scope.productList = [];
  function recalculateProductList(productCategoryName){

    const localArray = [];
    //$scope.productList = [];
    var productCodeList = $scope.productCategory[productCategoryName];
    console.log("Selected category name : " + productCategoryName + " size : " + productCodeList.length);

    $scope.columns.forEach((column)=>{column.availableRowCount = 0;});

    resetColumnMinMaxValues($scope.columns);
    $scope.filters = {};

    productCodeList.forEach(function(productCode) {
          const product = $scope.products[productCode];
          localArray.push(product)
          calculateColumnStatistics(product);
    });

    $scope.productCount = localArray.length;
    $scope.productList = localArray;
    $scope.visibleProductCount = 100;
  }


  $scope.selectedCategoryName;
  $scope.selectProductCategory = function(categoryName){
    $scope.selectedCategoryName = categoryName;
    $('#product-selection-modal').modal('toggle');
    recalculateProductList($scope.selectedCategoryName);
  }

  $scope.sortByCategorName = false;
  $scope.productCategory = {};
  $scope.categories;

  function createOrderedcategories(){
    $scope.categories = Object.entries($scope.productCategory).map( ([key, value]) => ({ categoryName : key, numberOfProducts: value.length }) )
    $scope.categories.sort(function(a,b){
      if (a.numberOfProducts > b.numberOfProducts)
        return -1;
      if (a.numberOfProducts < b.numberOfProducts)
        return 1;
      return 0;
    });
  }

  function addToCategory(productCode, categoryName){
    if(!$scope.productCategory[categoryName]){
      $scope.productCategory[categoryName] = [];
    }
    $scope.productCategory[categoryName].push(productCode);
  }

  function parseProductCategoryFile(data){
      var lines = data.split("\n");
      //removes header line
      lines.shift();
      lines.forEach(function(line) {
          var tokens = line.split("\t");
          addToCategory(tokens[0],tokens[1]);
      });

      createOrderedcategories();
      console.log("End of prodect categories file parse");
  }


  function loadProductCategoryData(){
    showProgressMessage("Loading Data");
    $http.get("../tsv/products_categories_full.tsv")
    .then(function(response) {
        parseProductCategoryFile(response.data);
        hideProgressMessage();
    });
  }

  loadProductCategoryData();

  /////////////////////////////////
  /////////////////////////////////

  const nonFilterableColumns = ["code", "name","image","nutriscore"];
  $scope.columns = [];
  $scope.products = {};
  const defaultColumns = ["name","n_additives","nutriscore","energy_100g"];

  function parseProductFile(data){
      var lines = data.split("\n");
      //removes header line
      const columns = lines.shift().split("\t");

      columns.forEach(function(column){
        var columnObject = {name : column, isVisible : false, availableRowCount : 0};
        if((defaultColumns.indexOf(column) > -1)){
          columnObject.isVisible = true;
        }
        $scope.columns.push(columnObject);
      })

      lines.forEach(function(line) {
          var tokens = line.split("\t");
          var obj = {};
          for(var i = 0; i < tokens.length; i++){
            if((nonFilterableColumns.indexOf(columns[i]) > -1)){
                obj[columns[i]] = tokens[i];
            }else{
                obj[columns[i]] = Number(tokens[i]);
            }
          }
          $scope.products[obj.code] = obj;
      });

      createOrderedcategories();
      console.log("End of product list parse");
  }


  function loadProductData(){
    showProgressMessage("Loading Data");
    $http.get("../tsv/products.tsv")
    .then(function(response) {
        parseProductFile(response.data);
        hideProgressMessage();
    });
  }

  loadProductData();

});
