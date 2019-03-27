let svg = d3.select("svg")
let margin = {top: 20, right: 20, bottom: 30, left: 100}
let width = svg.attr("width") - margin.left - margin.right
let height = svg.attr("height") - margin.top - margin.bottom

let x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
let y = d3.scaleLinear().rangeRound([height, 0])

let g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

const keys = [
  {
    key: 'year'
  },
  {
    key: 'population',
    color: '#007bff'
  },
  {
    key: 'fertilityRate',
    color: '#6c757d'
  },
  {
    key: 'worldPopulationPercentage',
    color: '#28a745'
  },
  {
    key: 'globalRank',
    color: '#17a2b8'
  }
]

// sort button event
let sorted = false
let currentX = 0
let currentY = 1


d3.tsv("populationdata.tsv",(error, data)=>{
  if (error) throw error // set axis
    console.log(data)

  // clean up dataset
  data.forEach(d=>{
    Object.keys(d).forEach(keys=>{
        let value = d[keys]
        if(value.includes('%')){
            parsed = parseFloat((parseFloat(value)/100).toFixed(4))
        }
        else if(value.includes(',')){
            parsed = parseFloat(value.replace(/,/g, ""))
        }
        else{
            parsed = parseFloat(value)
        }
        
        if(!isNaN(parsed)){
            d[keys] = parsed
        }else{
            d[keys] = value        
        }           
    })
  })

  // sort data ascendingly by date
  data.sort((thisYear, thatYear)=>{
    return thisYear.year - thatYear.year
  })  

  drawChart(keys[currentX], keys[currentY], data)

  function drawChart(horz, vert, data){
    // console.log(data)

    x.domain(data.map(d=>d[horz.key]))
    y.domain([0, d3.max(data, d=>d[vert.key])])

    // x axis
    g
    .append("g")
    .merge(g)
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

    // y axis
    g
    .append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Frequency")

    // bars
    g
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d=>x(d[horz.key]))
    .attr("y", d=>y(d[vert.key]))
    .attr("width", x.bandwidth())
    .attr("height", d=>height - y(d[vert.key]))
    .attr('fill', vert.color)
  }

  function removeOldData(){
    g
    .selectAll(".bar")
    .data([])
    .exit()
    .remove()
    g
    .selectAll("g")
    .data([])
    .exit()
    .remove()  
  }

  
  d3
  .select('#population').on('click', ()=>{
      console.log('population')
      removeOldData()
      sorted = false
      currentX = 0
      currentY = 1
      drawChart(keys[currentX], keys[currentY], data)
  })

  d3
  .select('#sort_ascending').on('click', ()=>{
    console.log('sort ascendingly')
    if(!sorted){
      removeOldData()
      const as_data = sortAscendingly(data)
      drawChart(keys[currentX], keys[currentY], as_data)
      sorted = true
    }else{
      removeOldData()
      drawChart(keys[currentX], keys[currentY], data)
      sorted = false
    }
  })

  d3.select('#fertility_rate').on('click', ()=>{
      console.log('fertility_rate')
      removeOldData()
      sorted = false
      currentX = 0
      currentY = 2
      drawChart(keys[currentX], keys[currentY], data)
  })

  d3.select('#global_rank').on('click', ()=>{
      console.log('global_rank')
      removeOldData()
      sorted = false
      currentX = 0
      currentY = 4
      drawChart(keys[currentX], keys[currentY], data)
  })

  function sortAscendingly(data){
    // sort data ascendingly
    let as_sorted = data.concat().sort((thisYear, thatYear)=>{
      return thisYear[keys[currentX].key] - thatYear[keys[currentY].key]
    })  

    return as_sorted
  }

})