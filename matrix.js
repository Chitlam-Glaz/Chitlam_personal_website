// matrix.js
document.addEventListener("DOMContentLoaded", function () {
    // Define the nodes (same as in nodelink.js)
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

    // Define the links (updated with animation -> video production)
    const links = [
        { source: "hobby", target: "film" },
        { source: "hobby", target: "anime" },
        { source: "hobby", target: "football" },
        { source: "hobby", target: "sharing" },
        { source: "film", target: "video production" },
        { source: "anime", target: "animation" },
        { source: "football", target: "watch Hong Kong football" },
        { source: "sharing", target: "running social media" },
        { source: "animation", target: "video production" } // New link
    ];

    // Create adjacency matrix
    const nodeIds = nodes.map(node => node.id);
    const matrix = Array(nodeIds.length).fill().map(() => Array(nodeIds.length).fill(false));

    // Populate the matrix based on links
    links.forEach(link => {
        const sourceIndex = nodeIds.indexOf(link.source);
        const targetIndex = nodeIds.indexOf(link.target);
        matrix[sourceIndex][targetIndex] = true;
        matrix[targetIndex][sourceIndex] = true; // Assuming undirected graph; remove if directed
    });

    // Select the section to append the matrix
    const section = d3.select("#vis-matrix");

    // Create a table for the adjacency matrix
    const table = section.append("table")
        .attr("class", "adjacency-matrix");

    // Append header row with node IDs
    const header = table.append("tr");
    header.append("th"); // Empty top-left cell
    nodeIds.forEach(id => {
        header.append("th")
            .text(id)
            .attr("class", "header");
    });

    // Append rows for the matrix
    matrix.forEach((row, i) => {
        const tr = table.append("tr");
        // Append row header with node ID
        tr.append("td")
            .text(nodeIds[i])
            .attr("class", "row-header");
        // Append cells for the matrix (no text, only class for styling)
        row.forEach(value => {
            tr.append("td")
                .attr("class", value ? "connected" : "empty");
        });
    });
});