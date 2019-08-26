import React, { Component } from 'react'

import Sankey from './sankey/sankey'
import Circular from './circular/circular'
import Scatter from './scatter/scatter'
import CircleFlow from './circle-flow/circle-flow'

import style from './graph.css'

import { ClassNames, BaseColor, NormalColor, ExtendColor } from '../../util'


/**
 * Sankey
 */
const SankeyGraph = {
    viewPort: { w: 20000, h: 10000 },
    init(that, data) {
        let nodes = {}, minYear, maxYear
        const getMax = (...args) => args.reduce((acc, v, i) => v > (acc || v) ? v : acc || v, null)
        const getMin = (...args) => args.reduce((acc, v, i) => v < (acc || v) ? v : acc || v, null)
        data.nodes.forEach(n => {
            const name = n.name, year = n.group
            minYear = getMin(minYear, year)
            maxYear = getMax(maxYear, year)
            nodes[name] || (nodes[name] = {
                name,
                id: n.ID,
                links: []
            })
            nodes[name].links.push({
                year: year,
                from: [],
                to: []
            })
        })
        minYear = Number.parseInt(minYear), maxYear = Number.parseInt(maxYear)
        data.links.forEach(l => {
            nodes[l.source].links.find(ls => ls.year === l.sourcegroup).to.push({
                year: l.targetgroup,
                name: l.target,
                value: l.value
            })
            nodes[l.target].links.find(ls => ls.year === l.targetgroup).from.push({
                year: l.sourcegroup,
                name: l.source,
                value: l.value
            })
        })
        for (let attr in nodes) {
            const n = nodes[attr]
            n.links.forEach(l => l.value = getMax(
                l.from.reduce((acc, v, i) => acc + v.value, 0),
                l.to.reduce((acc, v, i) => acc + v.value, 0)))
        }

        let Color, piece, values, blocks, gap, maxValue
        Color = BaseColor // TODO
        const len = maxYear - minYear + 1
        piece = 20000 / len
        values = new Array(len).fill(0)
        blocks = values.map(_ => [])
        let index = 0
        for (let attr in nodes) {
            const n = nodes[attr]
            n.links.forEach(l => {
                const i = Number.parseInt(l.year) - minYear
                values[i] += l.value
                blocks[i].push({ name: n.name, value: l.value })
            })
            n.color = Color[index++ % Color.length]
        }
        const num = blocks.reduce((acc, v, i) => v.length > acc ? v.length : acc, 0)
        gap = 1200 / (num + 1)
        maxValue = values.reduce((acc, v, i) => v > acc ? v : acc, 0)

        Object.assign(this, { that, nodes, minYear, maxYear, piece, blocks, gap, maxValue })
        that.nodes = nodes
    },
    render() {
        const { that, nodes, minYear, maxYear, piece, blocks, gap, maxValue } = this
        return <Sankey that={that}
            nodes={nodes} minYear={minYear} maxYear={maxYear}
            blocks={blocks} piece={piece} gap={gap} maxValue={maxValue} />
    }

}

/**
 * Circular
 */
const { cos, sin, PI } = Math

const CircularGraph = {
    viewPort: { w: 15000, h: 15000 },
    init(that, data) {
        let nodes = {}, links = data.links, nodeNum = 0, linkSum = 0, linkMax = 0
        data.nodes.forEach(n => {
            const node = nodes[n.name]
            if (node) {
                node.links.push({ year: n.group, from: 0, to: 0 })
                nodeNum++
            }
            else {
                nodes[n.name] = { name: n.name, id: n.ID, size: n.num, links: [{ year: n.group, from: 0, to: 0 }] }
                nodeNum++
            }
        })
        links.forEach(l => {
            const src = nodes[l.source], tar = nodes[l.target]
            const _src = src.links.find(sl => sl.year === l.sourcegroup), _tar = tar.links.find(tl => tl.year === l.targetgroup)
            _src.to += l.value
            _tar.from += l.value
            linkSum += l.value
            l.value > linkMax && (linkMax = l.value)
        })

        let Color, r, gap, peri
        Color = BaseColor //TODO
        r = 4000
        gap = PI / 6 / nodeNum // (2 PI / 12)
        peri = PI / 6 * 11
        let p = 0, index = 0
        for (let attr in nodes) {
            const node = nodes[attr]
            node.color = Color[index++ % Color.length]
            node.links.length > 1 && node.links.sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year))
            node.value = node.links.reduce((acc, ls, i) => acc + ls.from, 0)
            const v = node.value / linkSum * peri
            node.arc = { start: p, end: p + v, v }
            p = node.arc.end + gap
        }

        Object.assign(this, { that, nodes, links, nodeNum, linkSum, linkMax, r, gap, peri })
        that.nodes = nodes
    },
    render() {
        const { that, nodes, links, nodeNum, linkSum, linkMax, r, gap, peri } = this
        return <Circular that={that}
            nodes={nodes} links={links} nodeNum={nodeNum} linkSum={linkSum} linkMax={linkMax}
            r={r} gap={gap} peri={peri} />
    }
}

/**
 * Scatter
 */

const ScatterGraph = {
    viewPort: { w: 10000, h: 10000 },
    init(that, data) {
        const year = data.label, nodes = data.zp
        const range = nodes.reduce((acc, v, i) => {
            if (i) {
                acc.x[0] = acc.x[0] < v.weight ? acc.x[0] : v.weight
                acc.x[1] = acc.x[1] > v.weight ? acc.x[1] : v.weight
                acc.y[0] = acc.y[0] < v.height ? acc.y[0] : v.height
                acc.y[1] = acc.y[1] > v.height ? acc.y[1] : v.height
            } else {
                acc.x[0] = acc.x[1] = v.weight
                acc.y[0] = acc.y[1] = v.height
            }
            return acc
        }, { x: [0, 0], y: [0, 0] })
        range.x.v = range.x[1] - range.x[0]
        range.y.v = range.y[1] - range.y[0]
        this.viewPort.w = range.x.v * 13
        this.viewPort.h = range.y.v * 13

        Object.assign(this, { that, year, nodes, range })
    },
    render() {
        const { that, year, nodes, range } = this
        return <Scatter that={that} year={year} nodes={nodes} range={range} />
    }
}

/**
 * CircleFlow
 */

const CircleFlowGraph = {
    viewPort: { w: 20000, h: 15000 },
    init(that, data) {
        const nodes = data.cluster_nodes
        const froms = [], _froms = [],
            tos = [], _tos = []
        let sum = 0, fromSum = 0, toSum = 0
        nodes.forEach(v => {
            // TODO
            if (v.origin !== 'null') {
                froms.push(v)
                fromSum += v.weight
            } else {
                _froms.push(v)
            }
            if (v.aim !== 'null') {
                tos.push(v)
                toSum += v.weight
            } else {
                _tos.push(v)
            }
            sum += v.weight
        })

        Object.assign(this, {
            that, sum,
            from: { out: froms, self: _froms, sum: fromSum },
            to: { out: tos, self: _tos, sum: toSum }
        })
        that.nodes = nodes
    },
    render() {
        const { that, sum, from, to } = this
        return <CircleFlow that={that} sum={sum} from={from} to={to} />
    }
}


export default class Graph extends Component {
    constructor(props) {
        super(props)

        this.state = {
            active: false
        }
        this.init()
    }

    init(props = this.props) {
        let { graph, data } = props
        graph = {
            'sankey': SankeyGraph,
            'circular': CircularGraph,
            'scatter': ScatterGraph,
            'circle-flow': CircleFlowGraph
        }[graph]
        if (graph) {
            graph.init(this, data)
            this.Content = graph.render.bind(graph)
            this.viewPort = graph.viewPort
        }
    }
    componentWillReceiveProps(_) {
        this.init(_)
    }
    handleMouseMove(e) {
        this.state.active && this.setState({ x: e.clientX, y: e.clientY })
    }

    render() {
        const { props, state, Content, viewPort } = this

        return (
            <div className={style.main}>
                <svg viewBox={`0 0 ${viewPort.w} ${viewPort.h}`} preserveAspectRatio='xMinYMin meet' onMouseMove={this.handleMouseMove.bind(this)}>
                    {Content()}
                </svg>
                {state.active ?
                    <div style={{ left: state.x, top: state.y }} className={style.follow}>
                        <span style={{ backgroundColor: this.nodes[state.src.name].color }} className={style[`${state.active.split('-')[0]}-f`]}></span>
                        <span>{`${state.src.name}.${state.src.year || ''}`}</span>
                        {state.tar ?
                            <span>
                                {' ---->  '}
                                <span>{`${state.tar.name}.${state.tar.year}`}</span>
                            </span> : null}
                        {state.value ? ` : ${state.value.toFixed(2)}` : ''}
                    </div> : null}
            </div>
        )
    }
}
