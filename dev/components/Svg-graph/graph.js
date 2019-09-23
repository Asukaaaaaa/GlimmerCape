import React, { Component } from 'react'

import Sankey from './sankey/sankey'
import Circular from './circular/circular'
import Scatter from './scatter/scatter'
import CircleFlow from './circle-flow/circle-flow'

import style from './graph.css'

import { _, ClassNames, BaseColor, NormalColor, ExtendColor, host, imgs } from '../../util'

/**
 * Sankey
 */
const SankeyGraph = {
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
                links: []
            })
            nodes[name].links.push({
                year: year,
                id: n.ID,
                num: n.num,
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
        let nlen = 0
        for (let attr in nodes) nlen++
        Color = nlen > BaseColor.length ? (NormalColor) : BaseColor // TODO
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
        let nlen = 0
        for (let attr in nodes) nlen++
        Color = nlen > BaseColor.length ? (NormalColor) : BaseColor //TODO
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
    init(that, data) {
        const datas = data.map((d, i) => {
            const year = d.label, nodes = d.zp
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
            range.w = range.x.v * 13
            range.h = range.y.v * 13
            return { year, nodes, range }
        })

        Object.assign(this, { that, datas })
    },
    render() {
        const { that, datas } = this
        return <Scatter that={that} datas={datas} />
    }
}

/**
 * CircleFlow
 */

const CircleFlowGraph = {
    init(that) {
        const nodes = that.props.data
        const froms = [], _froms = [],
            tos = [], _tos = [],
            origins = {}, aims = {}
        let sum = 0, fromSum = 0, toSum = 0
        nodes.forEach(v => {
            // TODO
            if (v.origin !== 'null') {
                froms.push(v)
                fromSum += v.weight
                if (origins[v.origin]) {
                    origins[v.origin].counts++
                } else {
                    const node = that.data.sankey.nodes.find(n => n.ID === v.origin)
                    origins[v.origin] = {
                        name: node.name,
                        year: node.group,
                        counts: 1
                    }
                }
            } else {
                _froms.push(v)
            }
            if (v.aim !== 'null') {
                tos.push(v)
                toSum += v.weight
                if (aims[v.aim]) {
                    aims[v.aim].counts++
                } else {
                    const node = that.data.sankey.nodes.find(n => n.ID === v.aim)
                    aims[v.aim] = {
                        name: node.name,
                        year: node.group,
                        counts: 1
                    }
                }
            } else {
                _tos.push(v)
            }
            sum += v.weight
        })

        Object.assign(this, {
            that, sum,
            from: { out: froms, self: _froms, sum: fromSum, others: origins },
            to: { out: tos, self: _tos, sum: toSum, others: aims }
        })
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
            active: false, ok: false,
        }
        this.imgLoader = React.createRef()
    }

    init(props = this.props) {
        if (props.graph === 'sankey') {
            new Promise((resolve, reject) => $.post(host + '/result/getEvoFile', {
                model_id: props.mid
            }, res => {
                if (res.resultDesc === 'Success') {
                    fetch(host + res.data.split('Web_NEview')[1]).then(r => r.json()).then(res => {
                        resolve(res)
                    })
                }
            })).then(data => {
                SankeyGraph.init(this, data)
                this.Content = SankeyGraph.render.bind(SankeyGraph)
                this.viewPort = SankeyGraph.viewPort
                this.setState({ ok: true })
            })
        } else if (props.graph === 'scatter') {
            new Promise((resolve, reject) => $.post(host + '/result/getZpFile', {
                model_id: props.mid
            }, res => {
                if (res.resultDesc === 'Success') {
                    fetch(host + res.data.split('Web_NEview')[1]).then(r => r.json()).catch(console.log).then(res => {
                        resolve(res)
                    })
                }
            })).then(data => {
                ScatterGraph.init(this, data)
                this.Content = ScatterGraph.render.bind(ScatterGraph)
                this.viewPort = ScatterGraph.viewPort
                this.setState({ ok: true })
            })
        } else if (props.graph === 'circular') {
            // todo
        }
    }
    componentDidMount() {
        this.init()
    }
    componentWillReceiveProps(_) {
        this.init(_)
    }

    handleMouseMove(e) {
        this.state.active && this.setState({ x: e.clientX, y: e.clientY })
    }

    render() {
        const { props, state, Content, viewPort } = this

        return state.ok ? (
            <div className={style.main}
                onMouseMove={e => state.active && this.setState({ x: e.clientX, y: e.clientY })}
            >
                <canvas ref={this.imgLoader} />
                <div className={style.download}>
                    <a>
                        <img src={imgs.download}
                            onClick={e => { // TODO export image
                                /*
                                const img = new Image(),
                                    canvas = this.imgLoader.current, context = canvas.getContext('2d'),
                                    a = $('+ div > a', canvas)[0]
                                img.onload = _e => {
                                    context.drawImage(img, 0, 0)
                                    a.href = canvas.toDataURL('image/png')
                                    a.download = new Date().getTime() + '.png'
                                    a.click()
                                    e.target.onclick = null
                                }
                                img.src = 'data:image/svg+xml;base64,' + btoa($('~ svg', canvas)[0].outerHTML)
                                */
                            }} />
                    </a>
                </div>
                {Content()}
                {state.active &&
                    <div style={{ left: state.x, top: state.y }} className={style.follow}>
                        <span style={{ backgroundColor: this.nodes[state.src.name].color }} className={style[`${state.active.split('-')[0]}-f`]}></span>
                        <span>{`${state.src.name}.${state.src.year || ''}`}</span>
                        {state.tar &&
                            <span>
                                {' ---->  '}
                                <span>{`${state.tar.name}.${state.tar.year}`}</span>
                            </span>}
                        {state.value ? ` : ${state.value.toFixed(2)}` : ''}
                    </div>}
            </div>
        ) : (
                null
            )
    }
}

export class Svg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            focus: [0.5, 0.5],
            bias: [0, 0],
            scale: 1
        }
        this.box = props.viewBox.split(' ').map(v => Number.parseFloat(v))
        this.svg = React.createRef()
    }

    componentDidMount() {
        this.svg.current.addEventListener('wheel',
            _.throttle(this.viewScale.bind(this), 33),
            { passive: false })
        const f = this.viewMove.bind(this)
        this.svg.current.onmousedown = this.svg.current.onmouseup = f
        this.svg.current.addEventListener('mousemove',
            _.throttle(f, 33),
            { passive: false }
        )
    }
    componentWillReceiveProps(props) {
        this.box = props.viewBox.split(' ').map(v => Number.parseFloat(v))
    }

    viewScale(e) {
        e.preventDefault()
        const scale = this.state.scale - e.deltaY / e.currentTarget.clientHeight * 3
        this.setState({
            focus: [e.offsetX / e.currentTarget.clientWidth, e.offsetY / e.currentTarget.clientHeight],
            bias: [0, 0],
            scale: scale > 1 ? scale : 1
        })
    }
    viewMove(e) {
        e.preventDefault()
        if (e.type === 'mousedown') {
            this.dragging = true
        } else if (e.type === 'mouseup') {
            this.dragging = false
        } else if (e.type === 'mousemove' && this.dragging) {
            const { focus, bias, scale } = this.state
            this.setState({
                bias: [
                    bias[0] + e.movementX / e.currentTarget.clientWidth,
                    bias[1] + e.movementY / e.currentTarget.clientHeight
                ]
            })
        }
    }
    getViewBox(box = this.box, { focus, bias, scale } = this.state) {
        const w = box[2] / scale, h = box[3] / scale,
            x = box[0] + (box[2] - w) * focus[0] - w * bias[0],
            y = box[1] + (box[3] - h) * focus[1] - h * bias[1]
        return `${x} ${y} ${w} ${h}`
    }

    render() {
        return (
            <svg {...this.props} viewBox={this.getViewBox()}
                ref={this.svg}>
                {this.props.children}
            </svg>
        )
    }
}