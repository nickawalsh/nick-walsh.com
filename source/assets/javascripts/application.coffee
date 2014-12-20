#= require "d3"
#= require "d3.geo"
#= require "topojson"

map = (world, links) ->
  chart = (el) ->
    el.each((data) ->

      # Setup

      height = window.innerHeight
      width = window.innerWidth

      projection = d3.geo.aitoff()
        .rotate([50, -10, 10])
        .scale(Math.max(height, width) / 1.1 / Math.PI)
        .translate([width / 2, height / 2])

      circle = d3.geo.circle()
      graticule = d3.geo.graticule()
      path = d3.geo.path().projection(projection)

      svg = d3.select(this).selectAll('svg').data([data])

      # Init

      init = svg.enter().append('svg').append('g')

      init.append('path')
        .datum(graticule)
        .attr('class', 'map-graticule')

      init.append('path')
        .datum(topojson.feature(world, world.objects.land))
        .attr('class', 'map-surface')

      # Update

      svg
        .attr('height', height)
        .attr('width', width)

      g = svg.select('g')

      g.selectAll('.map-graticule')
        .attr('d', path)

      g.selectAll('.map-surface')
        .attr('d', path)

      g.selectAll('.map-halo')
        .data((d) -> d)
        .enter().append('path')
          .attr('class', 'map-halo')
          .attr('d', (d) =>
            path(circle.origin(d.plot).angle(0).precision(55)())
          )

      g.selectAll('.map-halo')
        .transition()
          .delay((d, i) -> 50 * i)
          .duration(1000)
          .ease('cubic-out')
          .attr('d', (d) =>
            path(circle.origin(d.plot).angle(d.r).precision(55)())
          )

      g.selectAll('.map-point')
        .data((d) -> d)
        .enter().append('path')
          .attr('class', 'map-point')
          .attr('d', (d) =>
            path(circle.origin(d.plot).angle(0).precision(100)())
          )

      g.selectAll('.map-point')
        .transition()
          .delay((d, i) -> 100 * i)
          .duration(1000)
          .ease('cubic-out')
          .attr('d', (d) =>
            path(circle.origin(d.plot).angle(d.r / 3).precision(100)())
          )

      g.selectAll('.map-path')
        .data(links)
        .enter().append('path')
          .attr('class', 'map-path')

      g.selectAll('.map-path')
        .attr('d', path)
        .attr('stroke-dasharray', (d) ->
          "#{this.getTotalLength()}, #{this.getTotalLength()}"
        )
        .attr('stroke-dashoffset', (d) -> this.getTotalLength())
        .transition()
          .delay((d, i) -> 100 * i)
          .duration(1000)
          .ease('cubic-out')
          .attr('stroke-dashoffset', 0)
    )

# https://remysharp.com/2010/07/21/throttling-function-calls

throttle = (fn, threshhold = 250, scope) ->
  last = ''
  deferTimer = ''
  hold = ->
    context = scope || this
    now = +new Date
    args = arguments
    if (last && now < last + threshhold)
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() ->
        last = now
        fn.apply(context, args)
      , threshhold)
    else
      last = now
      fn.apply(context, args)

document.addEventListener('DOMContentLoaded', () ->
  data = [
    {plot: [-81.173, 28.4], r: 7} # FL
    {plot: [-81.1, 32.084], r: 1} # Savannah
    {plot: [-74.006, 40.713], r: 3} # NY
    {plot: [-0.128, 51.507], r: 1} # London
    {plot: [-87.63, 41.878], r: 1} # Chicago
    {plot: [-122.419, 37.775], r: 1} # SF
    {plot: [-90.199, 38.627], r: 2} # St Louis
    {plot: [-77.345, 25.06], r: 2} # Nassau
    {plot: [-117.783, 33.542], r: 1} # Laguna
    {plot: [-149.9, 61.218], r: 1} # Anchorage
    {plot: [-123.121, 49.283], r: 1} # Vancouver
    {plot: [25.462, 36.393], r: 1} # Santorini
    {plot: [-122.676, 45.523], r: 2} # Portland
  ]

  links = []
  for coords in data
    links.push({
      type: 'LineString',
      coordinates: [data[0].plot, coords.plot]
    })

  d3.json('/assets/javascripts/world.json', (error, world) ->
    d3.select('body')
      .datum(data)
      .call(map(world, links))
      .classed('is-loading', false)

    d3.select(window).on('resize', throttle(() ->
      d3.select('body')
        .call(map(world, links))
    ), 1000)
  )
)
