const gdpurl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

const data = fetch(gdpurl)
                .then((res) => res.json())
                .then(data => drawBarCahrt(data));

const drawBarCahrt = (data) => {
    const dataset = data.data;
    const w = 1000;
    const h = 500;
    const padding = 50;
    const width = (w - 2*padding) / dataset.length;
    const max = d3.max(dataset, d => d[1]);
    const getYearFromDate = (date) => {
        return new Date(date);
        // return dateObj.getFullYear();
    }
    const firstDate = getYearFromDate(dataset[0][0]);
    const lastDate = getYearFromDate(dataset[dataset.length - 1][0]);

    const scale = d3.scaleLinear()
        .domain([0, max])
        .range([0, h - 2*padding]);
        
    const svg = d3.select(".barchart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
        
        
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d, i) => padding + i * width)
        .attr("y", d => h - padding - scale(d[1]))
        .attr("width", d => width)
        .attr("height", d => scale(d[1]))
        .attr("class", "bar")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .on("mouseover", (e, d) => {
            d3.select("#tooltip")
                .attr("data-date", d[0])
                .style("visibility", "visible")
                .text(d[0] + "\n" + d[1])
                .style("transform", `translateX(${e.clientX}px) translateY(${e.clientY}px)`)
                // .style("transform", ``)
            // console.log(e); 
        })
        .on("mouseout", (e, d) => {
            d3.select("#tooltip")
                .style("visibility", "hidden");
        })

    const xAxisScale = d3.scaleTime()
        .domain([firstDate, lastDate])
        .range([padding, padding + (dataset.length-1)*width])
    const xAxis = d3.axisBottom(xAxisScale);

    const yAxisScale = d3.scaleLinear()
        .domain([0,max])
        .range([h-2*padding, 0]);
    const yAxis = d3.axisLeft(yAxisScale);

    const xAxisLine = svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${0}, ${h - padding})`)
        .call(xAxis);

    let xAxisEl = xAxisLine.select(".domain");
    let newXAxisD = xAxisEl.attr("d").slice(0,-2).split("H")[0] + "H" +
        (+xAxisEl.attr("d").slice(0,-2).split("H")[1] + width);
    xAxisEl.attr("d", newXAxisD);

    const yAxisLine = svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, ${padding})`)
        .call(yAxis);

    let yAxisEl = yAxisLine.select(".domain");
    let newYAxisD = yAxisEl.attr("d").slice(0,-2);
    yAxisEl.attr("d", newYAxisD);

    
    d3.select(".barchart")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "hidden")
        .style("visibility", "hidden");
}