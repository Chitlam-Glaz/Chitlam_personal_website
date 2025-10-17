document.addEventListener("DOMContentLoaded", function () {
    // Define the tree data structure
    const treeData = {
        name: "interests",
        children: [
            {
                name: "music",
                children: [
                    { name: "Jpop", children: [
                        { name: "frequency", value: "daily" },
                        { name: "favorites", value: "Inferno" },
                        { name: "Band", value: "Mrs. GREEN APPLE" },
                        { name: "live", value: "Mrs. GREEN APPLE DOME LIVE 2023" }
                    ]},
                    { name: "Ani-song", children: [
                        { name: "frequency", value: "daily" },
                        { name: "favorites", value: "If I could be a constellation" },
                        { name: "band", value: "Kessoku Band" },
                        { name: "live", value: "Kessoku Band TOUR We will B" }
                    ]}
                ]
            },
            {
                name: "sports",
                children: [
                    { name: "football", children: [
                        { name: "frequency", value: "weekly" },
                        { name: "favorites", value: "FC Barcelona, Liverpool" },
                        { name: "playlists", value: "Match Highlights" },
                        { name: "galleries", value: "Stadium Shots" }
                    ]},
                    { name: "gym", children: [
                        { name: "frequency", value: "monthly" },
                        { name: "favorites", value: "idk" },
                        { name: "playlists", value: "gym Clips" },
                        { name: "galleries", value: "gym Moments" }
                    ]}
                ]
            },
            {
                name: "film",
                children: [
                    { name: "action", children: [
                        { name: "frequency", value: "monthly" },
                        { name: "favorites", value: "F1" },
                        { name: "playlists", value: "action movie" },
                        { name: "galleries", value: "movie highlights" }
                    ]},
                    { name: "anime", children: [
                        { name: "frequency", value: "monthly" },
                        { name: "favorites", value: "Spider-Man: Across the Spider-Verse" },
                        { name: "playlists", value: "anime movie" },
                        { name: "galleries", value: "movie highlights" }
                    ]}
                ]
            },
            {
                name: "anime",
                children: [
                    { name: "Isekai", children: [
                        { name: "frequency", value: "daily" },
                        { name: "favorites", value: "Mushoku Tensai" },
                        { name: "playlists", value: "Isekai" },
                        { name: "galleries", value: "anime list" }
                    ]},
                    { name: "romantic", children: [
                        { name: "frequency", value: "weekly" },
                        { name: "favorites", value: "Your name" },
                        { name: "playlists", value: "romantic" },
                        { name: "galleries", value: "anime list" }
                    ]}
                ]
            }
        ]
    };

    // Set dimensions and margins
    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    // Create SVG container
    const svg = d3.select("#vis-treedata")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create tree layout
    const tree = d3.tree().size([height, width]);

    // Convert the tree data to hierarchy
    const root = d3.hierarchy(treeData, d => d.children);
    tree(root);

    // Draw links (branches)
    svg.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x))
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2);

    // Draw nodes
    const node = svg.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    // Add circles for nodes
    node.append("circle")
        .attr("r", 5)
        .attr("fill", "#999");

    // Add labels
    node.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children ? -10 : 10)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name + (d.data.value ? `: ${d.data.value}` : ""));
});

// Optional CSS for styling
const style = document.createElement('style');
style.innerHTML = `
    .link { stroke: #ccc; stroke-width: 2px; }
    .node circle { fill: #999; }
    .node text { font: 12px sans-serif; }
`;
document.head.appendChild(style);