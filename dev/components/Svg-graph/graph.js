import React, { Component } from 'react'

import Sankey from './sankey/sankey'
import Circular from './circular/circular'
import Scatter from './scatter/scatter'

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
            const names = n.name.split('_')
            let year = Number.parseInt(names[0])
            minYear = getMin(minYear, year)
            maxYear = getMax(maxYear, year)
            if (names[1]) {
                const node = nodes[names[1]] || {
                    name: names[1],
                    links: []
                }
                node.links.push({
                    year: names[0],
                    from: [],
                    to: []
                })
                nodes[names[1]] = node
            }
        })
        let flows = {}
        data.links.forEach(l => {
            const source = l.source.split('_'), target = l.target.split('_')
            flows[source[0]] = flows[source[0]] || 0 + l.value
            if (source[1] && l.value) {
                nodes[source[1]].links.find(l => l.year === source[0]).to.push({
                    year: target[0],
                    name: target[1],
                    value: l.value
                })
            }
            if (target[1] && l.value) {
                nodes[target[1]].links.find(l => l.year === target[0]).from.push({
                    year: source[0],
                    name: source[1],
                    value: l.value
                })
            }
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

export default class Graph extends Component {
    constructor(props) {
        super(props)

        this.state = {
            active: false
        }
        this.init()
    }

    init(props = this.props) {
        const { graph, data } = props

        if (graph === 'sankey') {
            SankeyGraph.init(this, data)
            this.Content = SankeyGraph.render.bind(SankeyGraph)
            this.viewPort = SankeyGraph.viewPort
        }
        else if (graph === 'circular') {
            CircularGraph.init(this, data)
            this.Content = CircularGraph.render.bind(CircularGraph)
            this.viewPort = CircularGraph.viewPort
        }
        else if (graph === 'scatter') {

        }
        else {
            this.Content = () => null
            this.viewPort = {}
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
                <svg viewBox={`0 0 ${viewPort.w} ${viewPort.h}`} preserveAspectRatio='none' onMouseMove={this.handleMouseMove.bind(this)}>
                    {Content()}
                </svg>
                {state.active ?
                    <div style={{ left: state.x, top: state.y }} className={style.follow}>
                        <span className={style[`${state.active}-f`]}></span>
                        <span>{`${state.src.name}.${state.src.year||''}`}</span>
                        {state.tar ?
                            <span>
                                {' ---->  '}
                                <span>{`${state.tar.name}.${state.tar.year}`}</span>
                                {` : ${state.value.toFixed(2)}`}
                            </span> : null}
                        </div> : null}
            </div>
        )
    }
}
