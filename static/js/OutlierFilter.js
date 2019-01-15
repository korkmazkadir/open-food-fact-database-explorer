function OutlierFilter(){

  const nonFilterableColumns = ["code", "name","image","nutriscore"];

  var calculatedOutliers = {};

  function addToCalculatedOutliers(categoryName,outlierList){

  }

  function sortBy(list,columnName) {
    list.sort((a,b) => (a[columnName] > b[columnName]) ? 1 : ((b[columnName] > a[columnName]) ? -1 : 0));
  }

  function caculateQuartiles(list,columnName){

  }

  function calculateInterQuartileRange(quartiles){
    return quartiles.q3 - quartiles.q1;
  }

  function getOutliers(productList,columnName){
    const quartiles = caculateQuartiles(productList,columnName);
    const iqr = alculateInterQuartileRange(quartiles);
    const r = 1.5 * iqr;
    const outliers = productList.filter((p)=>{ return p[columnName] });
  }

  function filterOutlierByColumn(categoryName,productList,columnName){
      return new Promise((resolve, reject) => {
        setTimeout(function(){
          sortBy(productList,columnName);
          outliers = getOutliers(quartiles,productList,columnName);
          addToCalculatedOutliers(categoryName,outliers);
          resolve(true);
        }, 0);
      });
  }

  function filterOutliers(categoryName,productList,columns){
      if(calculatedOutliers[categoryName]){
        return calculatedOutliers[categoryName];
      }
      calculatedOutliers[categoryName] = [];

      //Filters filtarable columns
      columns = columns.filter((column)=>{
        return nonFilterableColumns.indexOf(column.name) === -1;
      });

      var copyProductList = productList.slice();

      columns.forEach((column)=>{
        Promise p =  filterOutlierByColumn(categoryName,copyProductList,column.name);
      });

  }


  return {
      filterOutliers : filterOutliers
  }
}
