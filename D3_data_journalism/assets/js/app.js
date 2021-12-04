// Significantly coded live along with Nathan D. during group homework help session
var svgSize = {
    width: 800,
    height: 450
}

var margin = {
    top: 30,
    bottom: 60,
    left: 60,
    right: 30
}

var chartSize = {
    width: svgSize.width - margin.left - margin.right,
    height: svgSize.height - margin.top - margin.bottom
}

var radius = 10;

var svg = d3.select("#scatter").append("svg")
    .attr("width", svgSize.width)
    .attr("height", svgSize.height)
    .attr("style", "border:1px solid black")
var frame = svg.append('g')
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

d3.csv(".\\assets\\data\\data.csv").then(data => {
    //console.log(data)
    data.forEach(state => {
        state.healthcare = +state.healthcare;
        state.income = +state.income
    })

    var xvals = data.map(state => state.healthcare)
    var yvals = data.map(state => state.income)

    var xScale = d3.scaleLinear()
        .domain([.9 * d3.min(xvals), d3.max(xvals)])
        .range([0, chartSize.width])
    var yScale = d3.scaleLinear()
        .domain([.9 * d3.min(yvals), d3.max(yvals)])
        .range([chartSize.height, 0])

    var bottomAxis = d3.axisBottom(xScale)
    var leftAxis = d3.axisLeft(yScale)

    frame.append("g").attr("transform", `translate(0, ${chartSize.height})`)
        .call(bottomAxis)
    frame.append("g").call(leftAxis)

    var chartData = frame.append("g").attr("id", "ChartData")

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function (d) {
            return "State: " + d.state + "<br>Healthcare: " + d.healthcare +"%" + "<br>Income: $" + d.income;
        })
    chartData.call(toolTip);


    var circles = chartData.selectAll("circle").data(data)
        .enter().append("circle")
        .attr("r", radius)
        .attr("cx", state => xScale(state.healthcare))
        .attr("cy", state => yScale(state.income))
        .attr('stroke', 'blue')
        .attr('fill', "blue")
        .attr("opacity", ".5")
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide)


    var text = chartData.selectAll("text").data(data)
        .enter().append("text").attr("class", "stateText")
        .attr("dx", state => xScale(state.healthcare) - radius / 2)
        .attr("dy", state => yScale(state.income) + radius / 2)
        .text(state => state.abbr)
})

