let svg = d3.select('svg')
let margin = {top: 20, right: 20, bottom: 30, left: 100}
let width = svg.attr('width') - 2*margin.left - 2*margin.right
let height = svg.attr('height') - 2*margin.top - 2*margin.bottom

let x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
let y = d3.scaleLinear().rangeRound([height, 0])

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const keys = [
  {
    key:'',
    label:'' 
  },
  {
    key: 'year',
    label: 'Year'
  },
  {
    key: 'population',
    label: 'Population'
  },
  {
    key: 'fertilityRate',
    label: 'Fertility Rate (Births per woman)'
  },
  {
    key: 'globalRank',
    label: 'Global Rank'
  }
]

const colors = [
  '#007bff',
  '#6c757d'
]


d3.tsv('populationdata.tsv',(error, data)=>{
  if (error) throw error 

  // clean up dataset
  data.forEach(d=>{
    Object.keys(d).forEach(keys=>{
        let value = d[keys]
        if(value.includes('%')){
            parsed = parseFloat((parseFloat(value)/100).toFixed(4))
        }
        else if(value.includes(',')){
            parsed = parseFloat(value.replace(/,/g, ''))
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
  data.sort((thisYear, thatYear)=>{
    return thisYear.year - thatYear.year
  })  

  // set starting values
  let currentX = 1
  let currentY = 2
  drawChart(keys[currentX], keys[currentY], data, 1, {x: keys[currentX].label, y: keys[currentY].label})
  drawChart(keys[1], keys[0], data, 2, {x: '', y: ''})

  function drawChart(horz, vert, data, id, axisLabels){
    d3
    .select('#dropdownMenuButton'+id)
    .text(vert.label)

    if(horz)
      x.domain(data.map(d=>d[horz.key]))

    if(vert)
      y.domain([0, d3.max(data, d=>d[vert.key])])


    if(id===1){

      // x axis
      g
      .append('g')
      .merge(g)
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))

      // text label for the x axis
      g
      .append('text')
      .attr('y', height)
      .attr('x', width+margin.right)
      .attr('dy', '2em')
      .style('text-anchor', 'middle')
      .attr('id', 'xLabel'+id)
      .text(axisLabels.x)

      // y axis
      g
      .append('g')    
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(10))

      // text label for the y axis
      g
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 1 - margin.left-20)
      .attr('x', 0 - (height / 2))
      .attr('dy', '2em')
      .style('text-anchor', 'middle')
      .attr('id', 'yLabel'+id)
      .text(axisLabels.y)
    }

    // line
    let line = d3
    .line()
    .x(d=>x(d[horz.key]))
    .y(d=>y(d[vert.key]))
    g
    .append('path')
    .data([data])
    .attr('class', 'line')
    .attr('d', line)
    .attr('stroke', colors[id-1])
    .attr('id', 'dataset'+id)

    // white curtain
    g
    .append("rect")
    .attr('id', 'curtain')
    .attr('x', 5)
    .attr('y', -5)
    .attr("width", width+10)
    .attr("height", height)
    .attr('fill', 'white')
    .transition()
    .attr('transform', 'translate('+width+')')
    .duration(3000)

  }

  function removeOldData(removalChoice){

    if(removalChoice===1){

      g.selectAll('g')
      .data([])
      .exit()
      .remove()
    }

    g
    .select('#yLabel'+removalChoice)
    .data([])
    .exit()
    .remove()

    g
    .select('#xLabel'+removalChoice)
    .data([])
    .exit()
    .remove()

    g
    .select('#dataset'+removalChoice)
    .data([])
    .exit()
    .remove()
  }


  // dropdown 1
  d3
  .select('.dropdown1')
  .select('#none')
  .on('click', ()=>{
      removeOldData(1)
      
      currentX = 1
      currentY = 0
      drawChart(keys[currentX], keys[currentY], data, 1, {x: keys[currentX].label, y: keys[currentY].label})
  })
  
  d3
  .select('.dropdown1')
  .select('#population')
  .on('click', ()=>{
      removeOldData(1)
      
      currentX = 1
      currentY = 2
      drawChart(keys[currentX], keys[currentY], data, 1, {x: keys[currentX].label, y: keys[currentY].label})
  })

  d3
  .select('.dropdown1')
  .select('#fertility_rate')
  .on('click', ()=>{
      removeOldData(1)
      
      currentX = 1
      currentY = 3
      drawChart(keys[currentX], keys[currentY], data, 1, {x: keys[currentX].label, y: keys[currentY].label})
  })

  d3
  .select('.dropdown1')
  .select('#global_rank')
  .on('click', ()=>{
      removeOldData(1)
      
      currentX = 1
      currentY = 4
      drawChart(keys[currentX], keys[currentY], data, 1, {x: keys[currentX].label, y: keys[currentY].label})
  })



  // dropdown 2
  d3
  .select('.dropdown2')
  .select('#none')
  .on('click', ()=>{
      removeOldData(2)
      
      currentX = 1
      currentY = 0
      drawChart(keys[currentX], keys[currentY], data, 2, {x: keys[currentX].label, y: keys[currentY].label})
  })

  d3
  .select('.dropdown2')
  .select('#population')
  .on('click', ()=>{
      removeOldData(2)
      
      currentX = 1
      currentY = 2
      drawChart(keys[currentX], keys[currentY], data, 2, {x: '',y: ''})
  })

  d3
  .select('.dropdown2')
  .select('#fertility_rate')
  .on('click', ()=>{
      removeOldData(2)
      
      currentX = 1
      currentY = 3
      drawChart(keys[currentX], keys[currentY], data, 2, {x: '',y: ''})
  })

  d3
  .select('.dropdown2')
  .select('#global_rank')
  .on('click', ()=>{
      removeOldData(2)
      
      currentX = 1
      currentY = 4
      drawChart(keys[currentX], keys[currentY], data, 2, {x: '',y: ''})
  })
})