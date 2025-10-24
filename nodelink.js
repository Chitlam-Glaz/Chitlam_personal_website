// nodelink.js
document.addEventListener("DOMContentLoaded", function () {
    // Define the data for the node-link diagram
    const nodes = [
        { id: "hobby", group: "hobby" },
        { id: "film", group: "sub-hobby" },
        { id: "anime", group: "sub-hobby" },
        { id: "football", group: "sub-hobby" },
        { id: "sharing", group: "sub-hobby" },
        { id: "video production", group: "activity" },
        { id: "animation", group: "activity" },
        { id: "watch Hong Kong football", group: "activity" },
        { id: "running social media", group: "activity" }
    ];

    const links = [
        // Hobby node links to film, anime, football, sharing
        { source: "hobby", target: "film" },
        { source: "hobby", target: "anime" },
        { source: "hobby", target: "football" },
        { source: "hobby", target: "sharing" },
        // Sub-hobby nodes link to activities
        { source: "film", target: "video production" },
        { source: "anime", target: "animation" },
        { source: "football", target: "watch Hong Kong football" },
        { source: "sharing", target: "running social media" },
        // New link: animation to video production
        { source: "animation", target: "video production" }
    ];

    // Set up the SVG container with larger dimensions
    const width = 800;
    const height = 600;
    const svg = d3.select("#vis-nodelink")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a force simulation with adjusted parameters
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link");

    // Draw nodes
    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node");

    // Add circles to nodes with different sizes for hierarchy
    node.append("circle")
        .attr("r", d => d.id === "hobby" ? 16 : 12) // Larger circle for hobby node
        .attr("fill", d => {
            if (d.group === "hobby") return "#69b3a2"; // Teal for hobby
            if (d.group === "sub-hobby") return "#a3c9e2"; // Light blue for sub-hobbies
            return "#ff6f61"; // Coral for activities
        });

    // Add labels to nodes
    node.append("text")
        .attr("dx", d => d.id === "hobby" ? 18 : 14) // Adjusted for node size
        .attr("dy", ".35em")
        .text(d => d.id);

    // Update positions on each tick of the simulation
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Add drag behavior
    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
});