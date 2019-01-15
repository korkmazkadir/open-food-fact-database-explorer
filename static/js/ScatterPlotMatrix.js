function ScatterPlotMatrix(rootElementId,width,height){

    this.plotAll = function(){
      plots.plot1.plot();
      plots.plot2.plot();
      plots.plot3.plot();
      plots.plot4.plot();
    }

    this.plot = function(plotIndex,data,xColumn,yColumn){
      plots["plot" + plotIndex].plot(data,xColumn,yColumn);
    }


    this.updatePlot = function(plotIndex, xMin, xMax, yMin, yMax){
      plots["plot" + plotIndex].updatePlot(xMin, xMax, yMin, yMax);
    }

    var plotSelectedEventListener;
    this.setPlotSelectedEventListener = function(listener){
      plotSelectedEventListener = listener;
    }

    function invokeListeners(plotIndex){
      if(plotSelectedEventListener){
        plotSelectedEventListener(plotIndex);
      }
    }


    var isZoomIn = false;

    const rootElement = d3.select("#"+rootElementId).append('svg:svg')
      .attr('width', width)
      .attr('height', height);

    const translationVectors = {
      vector1 : [0,0],
      vector2 : [1,0],
      vector3 : [0,1],
      vector4 : [1,1]
    }

    const plotContainers = {
      container1 : createPlotContainer(rootElement,1, 0, 0),
      container2 : createPlotContainer(rootElement,2, 1, 0),
      container3 : createPlotContainer(rootElement,3, 0, 1),
      container4 : createPlotContainer(rootElement,4, 1, 1)
    };

    const plots = {
      plot1 : new ScatterPlot('plot-1',width/2,height/2),
      plot2 : new ScatterPlot('plot-2',width/2,height/2),
      plot3 : new ScatterPlot('plot-3',width/2,height/2),
      plot4 : new ScatterPlot('plot-4',width/2,height/2),
    };

    function translate(x,y,scale){
      return "translate(" + x + "," + y +") scale(" + scale + ")";
    }

    function createPlotContainer(rootElement,plotIndex, translateX, translateY ){

      const container = rootElement
        .append('svg:g')
            .attr('id', 'container-plot-' + plotIndex)
            .attr('transform', translate(width/2 * translateX, height/2 * translateY, 0.5));
              //.on("click", function(){ isZoomIn ? zoomOut() : zoomIn(plotIndex); });

      container.append('svg:rect')
        .attr('width','100%')
        .attr('width','100%')
        .attr('class','plot')
        .attr('id', 'rect-' + plotIndex )
        .attr('fill-opacity','0.01')
          .on("click", function(){
            d3.select('rect.selected-plot').attr('class','');
            d3.select(this).attr("class", "selected-plot");
            invokeListeners(plotIndex);
          });;

      container.append('svg:g')
        .attr('id', 'plot-' + plotIndex)
        .attr('plot-index', plotIndex)
        .append('svg:image')
          .attr('height',30)
          .attr('width',30)
          .attr('href','../static/img/icons8-expand-50.png')
          .attr('class','zoom-icon')
          .attr('transform','translate(' + (width - 30) + ',' + 2 + ')')
            .on("click", function(){
              const plotIndex = d3.select(this.parentNode).attr("plot-index");
              console.log("Plot index : " + plotIndex);
              const clicked = d3.select(this);
              if(isZoomIn){
                clicked.attr('href', '../static/img/icons8-expand-50.png');
                zoomOut();
              }else{
                d3.select('rect.selected-plot').attr('class','');
                d3.select('#rect-' + plotIndex).attr("class", "selected-plot");
                clicked.attr('href', '../static/img/icons8-collapse-50.png');
                zoomIn(plotIndex);
                invokeListeners(plotIndex);
              }
            });

      return container;
    }

    function selectPlot(){

    }

    function zoomIn(plotIndex){
      isZoomIn = true;
      console.log("Zoom in " + plotIndex);

      Object.keys(plotContainers).forEach(function(key,index) {

        const transform = d3.transform(plotContainers[key].attr("transform"));

        console.log("Object : " + JSON.stringify(transform));
        if(key === "container" + plotIndex){
          plotContainers[key]
            .transition()
              .duration(500)
              .ease("quad")
                .attr("transform", translate(0, 0, 1));

        }else{
          plotContainers[key]
            .transition()
              .duration(500)
              .ease("quad")
                .attr("transform", translate(0, 0, 0));
        }
      });

    }

    function zoomOut(){
      isZoomIn = false;

      console.log("Zoom out");
      for(var i = 1;i<=4;i++){
        console.log("i --> " + i);
        plotContainers["container" + i]
          .transition()
            .duration(500)
            .ease("quad")
            .attr("transform", translate(translationVectors["vector" + i][0] * width/2 , translationVectors["vector" + i][1] * height/2, 0.5));
      }

    }


}
