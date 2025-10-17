const pieData = [
    { type: "Photography", percentage: 30 },
    { type: "Animation", percentage: 10 },
    { type: "3D Modeling", percentage: 20 },
    { type: "Interactive Design", percentage: 20 },
    { type: "New Media", percentage: 20 }
];

// Set dimensions and margins
const pieWidth = 600; // Width of the SVG
const pieHeight = 600; // Height of the SVG
const pieRadius = Math.min(pieWidth, pieHeight) / 2; // Radius of the pie chart

// Create SVG container
const pieSvg = d3.select("#vis-piechart")
    .append("svg")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
    .append("g")
    .attr("transform", `translate(${pieWidth / 2 - 5}, ${pieHeight / 2})`); // Shift left by 50 pixels

// Create pie generator
const pie = d3.pie()
    .value(d => d.percentage)
    .sort(null); // Preserve data order

// Create arc generator
const pieArc = d3.arc()
    .innerRadius(0) // For a pie chart (not donut)
    .outerRadius(pieRadius - 10); // Slightly smaller for padding

// Color scale
const pieColor = d3.scaleOrdinal()
    .domain(pieData.map(d => d.type))
    .range(d3.schemeCategory10); // Use D3's built-in color scheme

// Generate pie chart
const pieArcs = pieSvg.selectAll(".arc")
    .data(pie(pieData))
    .enter()
    .append("g")
    .attr("class", "arc");

// Append paths (slices)
pieArcs.append("path")
    .attr("d", pieArc)
    .attr("fill", d => pieColor(d.data.type))
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .append("title") // Tooltip
    .text(d => `${d.data.type}: ${d.data.percentage}%`);

// Add labels
pieArcs.append("text")
    .attr("transform", d => `translate(${pieArc.centroid(d)})`)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "white")
    .text(d => `${d.data.type} (${d.data.percentage}%)`);