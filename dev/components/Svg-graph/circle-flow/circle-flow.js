import React, { Component } from 'react'

import { Svg } from '../graph'

import style from './circle-flow.css'

const { cos, sin, PI } = Math,
    C = [10000, 7500], R = 6000, R0 = 4000, R1 = 9000

export default class CircleFlow extends Component {
    constructor(props) {
        super(props)
        this.state = { type: 'from' }
        this.init()
    }
    init(type = this.state.type, props = this.props) {
        const { that, sum } = props, data = props[type]
        let arc = data.sum / sum, dir = type === 'from' ? -1 : 1
        arc = [0.5 - arc, 0.5 + arc].map(v => v * dir)
        arc = arc.map(v => PI * v)
        let p = arc[0]
        data.out.forEach(v => {
            let arc = v.weight / sum, r = arc * PI, c = p + r * dir
            p = c + r * dir
            Object.assign(v, { x: C[0] + R * sin(c), y: C[1] - R * cos(c), r: R * sin(r) })
        })
        p = arc[0]
        data.self.forEach(v => {
            let arc = v.weight / sum, r = arc * PI, c = p - r * dir
            p = c - r * dir
            Object.assign(v, { x: C[0] + R * sin(c), y: C[1] - R * cos(c), r: R * sin(r) })
        })
        p = dir * PI / 4
        for (let attr in data.others) {
            const v = data.others[attr]
            let arc = v.counts / data.out.length
            arc = arc > 0.33 ? 0.33 : arc
            let r = arc * PI / 4, c = p + r * dir
            p = c + r * dir
            Object.assign(v, { x: C[0] + R1 * sin(c), y: C[1] - R1 * cos(c), r: R0 * sin(r), fill: that.nodes[v.name].color })
        }
    }
    componentWillUpdate(props, state) {
        this.init(state.type)
    }
    componentWillReceiveProps(props) {
        this.init(props = props)
    }
    Content() {
        const { state, props } = this
        const data = props[state.type], label = state.type === 'from' ? 'origin' : 'aim'
        return (
            <g className={style.main}>
                <g className={style.lines}>{data.out.map((val, i) => {
                    const { x, y, r } = val
                    return < path d={`M${x} ${y} L${data.others[val[label]].x} ${data.others[val[label]].y}`} stroke={data.others[val[label]].fill} key={i} />
                })}</g>
                <g className={style.out}>{data.out.map((val, i) => {
                    const { x, y, r } = val
                    return <circle cx={x} cy={y} r={r} fill={data.others[val[label]].fill} key={i} />
                })}</g>
                <g>{data.out.map(({ key, x, y, r }, i) => <text x={x} y={y} fontSize={r} key={i}>{key}</text>)}</g>
                <g className={style.self}>{data.self.map(({ x, y, r }, i) => <circle cx={x} cy={y} r={r} key={i} />)}</g>
                <g>{data.self.map(({ key, x, y, r }, i) => <text x={x} y={y} fontSize={50 + r} fontWeight={r} key={i}>{key}</text>)}</g>
                <g>{(() => {
                    const res = []
                    for (let attr in data.others) {
                        const { name, x, y, r, fill } = data.others[attr]
                        res.push(<circle cx={x} cy={y} r={r} fill={fill} key={attr} />)
                        res.push(<text x={x} y={y} fontSize={r} key={'T' + attr}>{name}</text>)
                    }
                    return res
                })()}</g>
                <circle cx={C[0]} cy={C[1]} r='400' className={state.type === 'from' ? style.out : style.self}
                    onClick={e => this.setState({ type: state.type === 'from' ? 'to' : 'from' })}
                ></circle>
            </g>
        )
    }

    handleResetState() {

    }
    handleHoverNode(e) {

    }
    handleHoverLink(e) {

    }

    render() {
        return (
            <Svg viewBox='0 0 20000 15000' preserveAspectRatio='xMinYMin meet' >
                {this.Content()}
            </Svg>
        )
    }
}
