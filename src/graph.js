import * as d3 from 'd3'
import _ from 'lodash'
import dataset from './dataset'

class Graph {
    constructor(el, data, opts) {
        this.el = el
        this.container = null
        this.pie = null
        this.data = data

        this.initOpts(opts)
        return this
    }
    initOpts(opts) {
        let default_opts = {
            arc: {
                inner_r_0: 170,
                outer_r_0: 190,
                inner_r_1: 100,
                outer_r_1: 130
            },
            pie: {
                padAngle: 0.035
            },
            width: 400,
            height: 400
        }
        this.opts = _.merge(default_opts, opts)
    }
    createArc() {
        const opts = this.opts
        const width = opts.width
        const height = opts.height

        const color_function = d3.scaleOrdinal().domain(this.data.length).range(d3.schemeCategory10)
        this.color_function = color_function

        const { inner_r_0, outer_r_0, inner_r_1, outer_r_1 } = opts.arc
        const { padAngle } = opts.pie

        const arc_function = d3.arc()
            .innerRadius(inner_r_0)
            .outerRadius(outer_r_0)

        const arc_function_1 = d3.arc()
            .innerRadius(inner_r_1)
            .outerRadius(outer_r_1)

        this.pie = d3.pie()
            .padAngle(padAngle)
            .sort(null)
            .value(d => d.value)

        !this.containe && d3.select(this.el).empty()

        const svg = d3.select(this.el).append('svg')
            .attr('width', width)
            .attr('height', height)

        const g = svg.append('g')
            .attr('transform', `translate(${ width / 2 }, ${ height / 2 })`)

        this.container = g

        const arc_pie_data = this.pie(this.data)
        const r = inner_r_0
        const arc_pie_circle = _.map(arc_pie_data, (d) => {
            let centroid = arc_function_1.centroid(d)
            d.circle_x = centroid[0]
            d.circle_y = centroid[1]

            return d
        })
        this.arc_pie_circle = arc_pie_circle

        const pie_group = g.selectAll('g')
            .data(arc_pie_data)
            .enter()
            .append('g')

        pie_group.append('path')
            .attr('d', d => arc_function(d))
            .attr('fill', (d, i) => color_function(i))

        const circles_pos = g.append('g')
        circles_pos.selectAll('circle')
            .data(arc_pie_circle)
            .enter()
            .append('circle')
            .attr('cx', d => d.circle_x)
            .attr('cy', d => d.circle_y)
            .attr('r', 5)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr('stroke-opacity', 0.9)
            .attr('stroke-dasharray', 1)

        return this
    }
    createGraph() {
        const opts = this.opts
        const width = opts.width
        const height = opts.height

        const color_function = this.color_function
        const { inner_r_0, outer_r_0, inner_r_1, outer_r_1 } = opts.arc
        const arc_pie_circle = this.arc_pie_circle
        const g = this.container

        const arc_pie_circle_group = _.keyBy(arc_pie_circle, 'index')
        dataset.nodes = dataset.nodes.map(d => {
            d.gx = arc_pie_circle_group[d.g].circle_x
            d.gy = arc_pie_circle_group[d.g].circle_y
            return d
        })


        const force = d3.forceSimulation(dataset.nodes)
            .force("charge", d3.forceManyBody())
            .force("link", d3.forceLink(dataset.edges).distance(10))
            .force("collide", d3.forceCollide(20))

        for (let i = 0; i < 100; i++) {
            force.tick()
        }

        const edges = g.append('g').selectAll("line")
            .data(dataset.edges)
            .enter()
            .append("line")
            .style("stroke", "#ccc")
            .style("stroke-width", 2)
            .style("stroke-opacity", 0.5)

        const nodes_g = g.append('g').selectAll("g")
            .data(dataset.nodes)
            .enter()
            .append("g")

        const nodes = nodes_g.append('circle')
            .attr("r", 6)
            .style("fill", (d, i) => color_function(d.g))

        nodes_g.append("text")
            .attr('font-size', '10')
            .append("tspan")
            .text(d => d.name)
            .attr("fill", "#FFF")
            .attr("x", 6)
            .attr("y", -3)

        force.on("tick", () => {
            nodes.data().forEach((node, i) => {
                node.x += (node.gx - node.x) * 0.04
                node.y += (node.gy - node.y) * 0.04
            })

            edges.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)

            nodes_g.attr("transform", d => `translate(${ d.x }, ${ d.y })`)
        })

       return this
    }
}
export default Graph
