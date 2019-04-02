let svg = d3.select("svg")
let margin = {top: 20, right: 20, bottom: 30, left: 40}
let width = svg.attr("width") - margin.left - margin.right
let height = svg.attr("height") - margin.top - margin.bottom;

let x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
let y = d3.scaleLinear().rangeRound([height, 0]);

let g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let globaldata

d3.tsv("data.tsv", (error, data)=>{
  if (error) throw error; // set axis

  globaldata = data

  drawChart(globaldata)
});

function drawChart(data){
  console.log('drawing chart')

  x.domain(data.map(d=>d.name));
  y.domain([0, d3.max(data, d=>d.age)]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d=>x(d.name))
      .attr("y", d=>y(d.age))
      .attr("width", x.bandwidth())
      .attr("height", d=>height - y(d.age)); 


  g.selectAll(".bar")
    .data(data)
    .exit()
    .remove()
}


d3.select('#sort_ascending').on('click', ()=>{
  data = manipulateData(globaldata)
  drawChart(data)
})

function manipulateData(data){
  let as_sorted = data.sort((thisDog, thatDog)=>{
    return thisDog.age - thatDog.age
  })

  return as_sorted
}
