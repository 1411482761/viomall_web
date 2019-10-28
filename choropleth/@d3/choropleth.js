// https://observablehq.com/@d3/choropleth@204
import define1 from "../@d3/color-legend.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Choropleth

Unemployment rate by county, August 2016. Data: [Bureau of Labor Statistics](http://www.bls.gov/lau/#tables)`
)});
  main.variable(observer("chart")).define("chart", ["d3","legend","color","data","topojson","us","path","states","format"], function(d3,legend,color,data,topojson,us,path,states,format)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, 975, 610]);

  svg.append("g")
      .attr("transform", "translate(610,20)")
      .append(() => legend({color, title: data.title, width: 260}));

  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
      .attr("fill", d => color(data.get(d.id)))
      .attr("d", path)
    .append("title")
      .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
${format(data.get(d.id))}`);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["d3"], async function(d3){return(
Object.assign(new Map(await d3.csv("https://gist.githubusercontent.com/mbostock/682b782da9e1448e6eaac00bb3d3cd9d/raw/0e0a145ded8b1672701dc8b2a702e51c648312d4/unemployment.csv", ({id, rate}) => [id, +rate])), {title: "Unemployment rate (%)"})
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3.scaleQuantize([1, 10], d3.schemeBlues[9])
)});
  main.variable(observer("path")).define("path", ["d3"], function(d3){return(
d3.geoPath()
)});
  main.variable(observer("format")).define("format", function(){return(
d => `${d}%`
)});
  main.variable(observer("states")).define("states", ["us"], function(us){return(
new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))
)});
  main.variable(observer("us")).define("us", ["d3"], function(d3){return(
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  return main;
}
