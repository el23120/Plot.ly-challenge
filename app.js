
function optionChanged(idNum) {
    console.log(idNum);

    // Read in samples.json with D3 library
    d3.json("samples.json").then(function(data) {

        // Pull metadata values for matching subject ID Number
        metadata = Object.values(data.metadata.filter(function(findMeta) {
            return findMeta.id.toString() == idNum;
        }));
        metadata = metadata[0];
        console.log(metadata);

        // Clear the Demographic Info under the "sample-metadata" ID, 
        // then fill it in using the entry's key-value pairs
        d3.select("#sample-metadata").html("");
        Object.entries(metadata).forEach(([key, value]) => {
            d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
        });

        // Pull sample values for matching subject ID Number
        samples = Object.values(data.samples.filter(function(findSample) {
            return findSample.id.toString() == idNum;
        }));
        samples = samples[0];
        console.log(samples);

        // Sort samples by sample_values in descending order
        samples.sample_values.sort(function sortFunction(a, b) {
            return b - a;
        });

        // Slice the top 10 values for sample_values, otu_ids, and otu_labels
        sample_values = samples.sample_values.slice(0, 10).reverse();
        otu_ids = samples.otu_ids.slice(0, 10).reverse();
        otu_labels = samples.otu_labels.slice(0, 10).reverse();
        console.log(sample_values, otu_ids, otu_labels);

        // Create horizontal bar chart with top 10 OTUs found for the subject
        // -- lables on y axis for horizontal chart
        var barGraph = [{
            x: sample_values,
            y: otu_ids.map(function(otuID) {return `OTU ${otuID}`;}),
            type: "bar",
            orientation: "h",
            hoverinfo: "text",
            hovertext: otu_labels
        }];

        var barLayout = {
            title: "<b>Top 10 OTUs</b>"
        }

        Plotly.newPlot("bar", barGraph, barLayout);

        // Create bubble chart that displays each sample for the subject
        var bubbleChart = [{
            x: samples.otu_ids,
            y: samples.sample_values,
            text: samples.otu_labels,
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

        Plotly.newPlot("bubble", bubbleChart, layout);

        // BONUS: Create gauge chart to plot weekly washing frequency for the subject
        var gaugeChart = [{
            domain: {
                x: [0, 1], 
                y: [0, 1]
            },
            value: metadata.wfreq,
            title: {
                text: "<span style='font-size: 20px;'><b>Belly Button Washing Frequency</b></span><br> Scrubs per Week"
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 9]},
                steps: [
                    {range: [0, 1], color: "rgb(238, 240, 235)"},
                    {range: [1, 2], color: "rgb(205, 217, 189)"},
                    {range: [2, 3], color: "rgb(186, 204, 161)"},
                    {range: [3, 4], color: "rgb(168, 191, 136)"},
                    {range: [4, 5], color: "rgb(152, 181, 112)"},
                    {range: [5, 6], color: "rgb(136, 171, 89)"},
                    {range: [6, 7], color: "rgb(123, 163, 70)"},
                    {range: [7, 8], color: "rgb(109, 153, 50)"},
                    {range: [8, 9], color: "rgb(96, 143, 34)"},
                ]
            }
        }];

        Plotly.newPlot("gauge", gaugeChart);
        
    });

}

// Read in samples.jason with D3 library
d3.json("samples.json").then(function(data) {
    console.log(data);

    var dropdownMenu = d3.select("#selDataset");

    // Create <option> elements for each ID number in "names"
    data.names.forEach(function(name) {
        dropdownMenu.append("option").text(name);
    });
    
    // Use optionChanged function to set default plots
    optionChanged("940");

});