function ScatterPlot(rootGroupElementId){
    console.log("Creating Scatter Plot");
    this.rootElement = d3.select("#"+rootGroupElementId);

    this.plot = function(){

          console.log("Scatter Plot Working");

          var data = [[5,3], [10,17], [15,4], [2,8]];

          var margin = {top: 20, right: 15, bottom: 60, left: 60}
            , width = 800 - margin.left - margin.right
            , height = 600 - margin.top - margin.bottom;

          var x = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) { return d[0]; })])
                    .range([ 0, width ]);

          var y = d3.scale.linear()
          	      .domain([0, d3.max(data, function(d) { return d[1]; })])
          	      .range([ height, 0 ]);

          var chart = this.rootElement
          	.attr('width', width + margin.right + margin.left)
          	.attr('height', height + margin.top + margin.bottom)
          	.attr('class', 'chart')

          var main = chart.append('g')
          	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
          	.attr('width', width)
          	.attr('height', height)
          	.attr('class', 'main')

          // draw the x axis
          var xAxis = d3.svg.axis()
          	.scale(x)
          	.orient('bottom');

          main.append('g')
          	.attr('transform', 'translate(0,' + height + ')')
          	.attr('class', 'main axis date')
          	.call(xAxis);

          // text label for the x axis
          main.append("text")
              .attr("transform",
                    "translate(" + (width/2) + " ," +
                                   (height + margin.top + 20) + ")")
              .attr("class", "axis-label")
              .style("text-anchor", "middle")
              .text("Date");

          // draw the y axis
          var yAxis = d3.svg.axis()
          	.scale(y)
          	.orient('left');

          main.append('g')
          	.attr('transform', 'translate(0,0)')
          	.attr('class', 'main axis date')
          	.call(yAxis);

          // text label for the y axis
          main.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 10 - margin.left)
              .attr("x",0 - (height / 2))
              .attr("dy", "1em")
              .attr("class", "axis-label")
              .style("text-anchor", "middle")
              .text("Value");


          var g = main.append("svg:g");

          g.selectAll("scatter-dots")
            .data(data)
            .enter().append("svg:circle")
                .attr("cx", function (d,i) { return x(d[0]); } )
                .attr("cy", function (d) { return y(d[1]); } )
                .attr("r", 8);

    };



}
