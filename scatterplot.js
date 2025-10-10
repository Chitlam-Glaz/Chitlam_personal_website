const data = [
            { year: 2018, type: "Painting", count: 5 },
            { year: 2018, type: "Writing", count: 3 },
            { year: 2018, type: "Music", count: 2 },
            { year: 2019, type: "Painting", count: 7 },
            { year: 2019, type: "Writing", count: 4 },
            { year: 2019, type: "Music", count: 1 },
            { year: 2020, type: "Painting", count: 2 },
            { year: 2020, type: "Writing", count: 6 },
            { year: 2020, type: "Music", count: 3 },
            { year: 2021, type: "Painting", count: 4 },
            { year: 2021, type: "Writing", count: 5 },
            { year: 2021, type: "Music", count: 4 }
        ];

        // Set dimensions and margins (scaled by 1.5)
        const margin = { top: 30, right: 45, bottom: 60, left: 150 }; // Scaled from {20, 30, 40, 100}
        const width = 900 - margin.left - margin.right; // 600 * 1.5 = 900
        const height = 600 - margin.top - margin.bottom; // 400 * 1.5 = 600

        // Create SVG container
        const svg = d3.select("#vis-scatterplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Extract unique years
        const years = [...new Set(data.map(d => d.year))].sort();

        // Set scales
        const x = d3.scalePoint()
            .domain(years)
            .range([0, width])
            .padding(0.5);

        const y = d3.scaleBand()
            .domain(data.map(d => d.type).filter((v, i, a) => a.indexOf(v) === i))
            .range([0, height])
            .padding(0.3);

        const r = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.count)])
            .range([3, 30]); // Scaled radius range from [2, 20] by 1.5

        // Add X axis (one tick per year)
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .attr("class", "axis")
            .call(d3.axisBottom(x));

        // Add Y axis with better spacing
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-1.2em") // Scaled from -0.8em
            .attr("dy", ".15em");

        // Add dots
        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.type) + y.bandwidth() / 2)
            .attr("r", d => r(d.count))
            .append("title") // Tooltip
            .text(d => `${d.type} (${d.year}): ${d.count} works`);

        // Add axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 7.5) // Scaled from -5
            .style("text-anchor", "middle")
            .style("font-size", "18px") // Scaled from implicit default
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 22.5) // Scaled from 15
            .style("text-anchor", "middle")
            .style("font-size", "18px") // Scaled from implicit default
            .text("Type of Creative Work");