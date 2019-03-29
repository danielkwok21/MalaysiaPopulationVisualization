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

// sort button event
let sorted = false
let currentX = 0
let currentY = 1


d3.tsv('populationdata.tsv',(error, data)=>{
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

  // sort data ascendingly by year
  data.sort((thisYear, thatYear)=>{
    return thisYear.year - thatYear.year
  })  

  drawChart(keys[currentX], keys[currentY], data, 1, {x: keys[currentX].label, y: keys[currentY].label})

  function drawChart(horz, vert, data, id, axisLabels){
    d3
    .select('#dropdownMenuButton'+id)
    .text(vert.label)

    // console.log(data)

    x.domain(data.map(d=>d[horz.key]))
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
      .attr('id', 'xLabel')
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
      .attr('y', 1 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '2em')
      .style('text-anchor', 'middle')
      .attr('id', 'yLabel')
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

  }

  function removeOldData(removalChoice){
    console.log('removalChoice: '+removalChoice)
    const id = '#dataset'+removalChoice


    if(removalChoice===1){
      g
      .select('#yLabel')
      .data([])
      .exit()
      .remove()
      g
      .select('#xLabel')
      .data([])
      .exit()
      .remove()

      g.selectAll('g')
      .data([])
      .exit()
      .remove()

    }

    g
    .selectAll('#dataset'+removalChoice)
    .data([])
    .exit()
    .remove() 

  
  }
  
  d3
  .select('.dropdown1')
  .select('#population')
  .on('click', ()=>{
      removeOldData(1)
      sorted = false
      currentX = 0
      currentY = 1
      drawChart(keys[currentX], keys[currentY], data, 1, {x: keys[currentX].label, y: keys[currentY].label})
  })

  d3
  .select('.dropdown1')
  .select('#fertility_rate')
  .on('click', ()=>{
      removeOldData(1)
      sorted = false
      currentX = 0
      currentY = 2
      drawChart(keys[currentX], keys[currentY], data, 1, {x: keys[currentX].label, y: keys[currentY].label})
  })

  d3
  .select('.dropdown1')
  .select('#global_rank')
  .on('click', ()=>{
      removeOldData(1)
      sorted = false
      currentX = 0
      currentY = 3
      drawChart(keys[currentX], keys[currentY], data, 1, {x: keys[currentX].label, y: keys[currentY].label})
  })


  d3
  .select('.dropdown2')
  .select('#population')
  .on('click', ()=>{
      removeOldData(2)
      sorted = false
      currentX = 0
      currentY = 1
      drawChart(keys[currentX], keys[currentY], data, 2, {x: '',y: ''})
  })

  d3
  .select('.dropdown2')
  .select('#fertility_rate')
  .on('click', ()=>{
      removeOldData(2)
      sorted = false
      currentX = 0
      currentY = 2
      drawChart(keys[currentX], keys[currentY], data, 2, {x: '',y: ''})
  })

  d3
  .select('.dropdown2')
  .select('#global_rank')
  .on('click', ()=>{
      removeOldData(2)
      sorted = false
      currentX = 0
      currentY = 3
      drawChart(keys[currentX], keys[currentY], data, 2, {x: '',y: ''})
  })
})