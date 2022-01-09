function optionChanged(idNum) {
   console.log(idNum);

d3.json("data/samples.json").then(function(data) {

   metadata = Object.values(data.metadata.filter(function(findMeta){
      return findMeta.id.toString() == idNum;
   }));
   metadata = metadata[0];
   console.log(metadata);

   d3.select("#sample-metadata").html("");
   Object.entries(metadata).forEach(([key, value]) => {
      d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
   });

   samples = Object.values(data.samples.filter(function(findsample) {
      return findsample.id.tostring() == idNum;
   }));
   samples = samples[0];
   console.log(samples);

   samples.sample_values.sort(function sortFunction(a, b) {
      return b - a;
   });

   sample_values = samples.sample_values.slice(0, 10).reverse();
   otu_ids = samples.otu_ids.slice(0, 10).reverse();
   otu_lables = samples.otu_lables.slice(0, 10).reverse();
   console.log(sample_values, otu_ids, otu_lables);

   var barGraph = [{
      x: sample_values,
      y: otu_ids.map(function(otuID) {return `OTU ${otuID}`;}),
      type: "bar",
      orientation: "h",
      hoverinfo: "text",
      hovertext: otu_lables
   }];
   var barLayout = {
      title:"<b>Top 10 OTUs</b>"
   }

   Plotly.newPlot("bar", barGraph, barLayout);

   var bubbleChart = [{
      x: samples.otu_ids,
      y: samples.sample_values,
      text: samples.otu_lables,
      mode: "markers",
      marker: {
         size: samples.sample_values,
         color: samples.otu_ids
      }
   }];

   var layout = {
      xaxis: {title: "OTU ID"},
      title: "<b>Values of All OTUs</b>"
   };

   Plotly.newPlot("buble", bubbleChart, layout);

   var gaugeChart = [{
      domain: {
         x: [0, 1],
         y: [0, 1]
      },
      value:metadata.wfreq,
      title: {
         text: "<Span style='font-size: 20px;'><b>Belly Button Washing Frequency</b></span><br> Scrubs per Week"
      },
      type:"indicator",
      mode: "gauge+number",
      gauge: {
         axis:{range: [null, 9]},
         steps: [
            {range: [0, 1], color: "rgb(238, 240, 235)"},
            {range: [1, 2], color: "rgb(205, 217, 189)"},
            {range: [2, 3], color: "rgb(186, 204, 161)"},
            {range: [3, 4], color: "rgb(168, 191, 136)"},
            {range: [4, 5], color: "rgb(152, 181, 112)"},
            {range: [5, 6], color: "rgb(136, 171, 89)"},
            {range: [6, 7], color: "rgb(123, 163, 70)"},
            {range: [7, 8], color: "rgb(109, 154, 49)"},
            {range: [8, 9], color: "rgb( 96, 143, 34)"},
         ]
      }
   }];

   Plotly.newPlot("gauge", gaugeChart);


});
}

d3.json("samples.json").then(function(data) {
   console.log(data);

   var dropdown = d3.select("#selDataset");

   data.names.forEach(function(name) {
      dropdownMenu.append("option").text(name);
   });

   optionChanged("940");

});