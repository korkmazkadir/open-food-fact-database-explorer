function ScatterPlot(rootGroupElementId){
    console.log("Creating Scatter Plot");
    this.rootElement = d3.select("#"+rootGroupElementId);

    this.updatePlot = function(x_min, x_max, y_min, y_max){

      if(x_min != -1 && x_max!= -1){
        console.log("->X axis");
        x.domain([x_min, x_max]);
        chart.select(".x")
        .transition()
          .call(xAxis);
      }

      if(y_min != -1 && y_max!= -1){
        console.log("->Y axis");
        y.domain([y_min, y_max]);
        chart.select(".y")
        .transition()
          .call(yAxis);
      }


      var predicates = Object.getOwnPropertyNames(visibilityPredicatesLocal).filter(function (p) {
          return typeof visibilityPredicatesLocal[p] === 'function';
      });

      circles.transition()
            .attr("cx", function (d,i) { return x(d[plotXColumn]); } )
            .attr("cy", function (d) { return y(d[plotYColumn]); } )
            .style("visibility", function (d) {
              var i;
              for (i = 0; i < predicates.length; i++) {
                if(visibilityPredicatesLocal[predicates[i]](d) === false){
                  return "hidden";
                }
              }
              return "visible";
            });

    }


    this.changeXAxis = function(columnName){
      xAxisLabel.text(columnName);
      plotXColumn = columnName;
      this.updatePlot(d3.min(plotData, function(d) {
        return d[plotXColumn];
      }),d3.max(plotData, function(d) {
        return d[plotXColumn];
      }),-1,-1);
    }

    this.changeYAxis = function(columnName){
      yAxisLabel.text(columnName);
      plotYColumn = columnName;
      this.updatePlot(-1,-1,d3.min(plotData, function(d) {
        return d[plotYColumn];
      }),d3.max(plotData, function(d) {
        return d[plotYColumn];
      }));
    }

    this.updateDotVisibilities = function(){
      var predicates = Object.getOwnPropertyNames(visibilityPredicatesLocal).filter(function (p) {
          return typeof visibilityPredicatesLocal[p] === 'function';
      });

      circles.transition()
      .attr("cx", function (d,i) { return x(d[plotXColumn]); } )
      .attr("cy", function (d) { return y(d[plotYColumn]); } )
            .style("visibility", function (d) {
              var i;
              for (i = 0; i < predicates.length; i++) {
                if(visibilityPredicatesLocal[predicates[i]](d) === false){
                  return "hidden";
                }
              }
              return "visible";
            });
    }

    var visibilityPredicatesLocal = {};
    this.setVisibilityPredicates = function( visibilityPredicates ){
      visibilityPredicatesLocal = visibilityPredicates;
    }

    this.updatePlotXAxis = function(min, max){
      console.log("X axis updated. min : " + min + " max : " + max );
      this.updatePlot(min,max,-1,-1);
    }

    this.updatePlotYAxis = function(min, max){
      console.log("Y axis updated. min : " + min + " max : " + max );
      this.updatePlot(-1,-1,min,max);
    }


    var x;
    var y;
    var xAxis;
    var yAxis;
    var chart;
    var g;
    var plotData;
    var plotXColumn;
    var plotYColumn;
    var circles;
    var xAxisLabel;
    var yAxisLabel;
    this.plot = function(data,xColumn,yColumn){

      console.log("Scatter Plot Working");

      if(!data){
        return;
      }

      plotData = data;
      plotXColumn = xColumn;
      plotYColumn = yColumn;

      console.log("Data size : " + data.length);

      var margin = {top: 20, right: 15, bottom: 60, left: 60}
        , width = 800 - margin.left - margin.right
        , height = 600 - margin.top - margin.bottom;

      x = d3.scale.linear()
                .domain([d3.min(data, function(d) {
                  return d[xColumn];
                }), d3.max(data, function(d) {
                  return d[xColumn];
                })])
                .range([ 0, width ]);

      y = d3.scale.linear()
              .domain([d3.min(data, function(d) {
                return d[yColumn];
              }), d3.max(data, function(d) {
                return d[yColumn];
              })])
              .range([ height, 0 ]);

      chart = this.rootElement
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'chart' + rootGroupElementId)

      var main = chart.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'main')

      // draw the x axis
      xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

      main.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'x main axis date')
        .call(xAxis);

      // text label for the x axis
      xAxisLabel = main.append("text")
          .attr("transform",
                "translate(" + (width/2) + " ," +
                               (height + margin.top + 20) + ")")
          .attr("class", "axis-label")
          .style("text-anchor", "middle")
          .text(xColumn);

      // draw the y axis
      yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      main.append('g')
        .attr('transform', 'translate(0,0)')
        .attr('class', 'y main axis date')
        .call(yAxis);

      // text label for the y axis
      yAxisLabel = main.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 1 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .attr("class", "axis-label")
          .style("text-anchor", "middle")
          .text(yColumn);


      g = main.append("svg:g");


      circles = g.selectAll("scatter-dots")
        .data(data)
        .enter().append("svg:circle")
            .attr("cx", function (d,i) { return x(d[xColumn]); } )
            .attr("cy", function (d) { return y(d[yColumn]); } )
            .attr("r", 3)
            .attr("fill",function (d) { return d3.rgb(getNutriscoreColor(d.nutriscore)) } );
    };


    function getNutriscoreColor(nutriscore){
      return nutriscore === "a" ? "#128043" :
                   nutriscore === "b" ? "#86b93b" :
                   nutriscore === "c" ? "#FDCA2F" :
                   nutriscore === "d" ? "#EC8122" :
                   nutriscore === "e" ? "#E43F21" : "black";
    }


}
