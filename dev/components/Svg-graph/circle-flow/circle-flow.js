import React, { Component } from 'react'

import style from './circle-flow.css'

const { cos, sin, PI } = Math,
    C = [10000, 7500], R = 6000, R1 = 8000

export default class CircleFlow extends Component {
    Nodes(type = 'from') {
        const { sum } = this.props, data = this.props[type]
        let arc = data.sum / sum, dir = type === 'from' ? -1 : 1
        type === 'from' && (arc = [arc - 0.5, -0.5 - arc])
        type === 'to' && (arc = [0.5 - arc, 0.5 + arc])
        arc = arc.map(v => PI * v)
        let p = arc[0], _p = arc[0]
        return (
            <g className={style.main}>
                <g>{
                    data.out.map((v, i) => {
                        let arc = v.weight / sum, r = arc * PI, c = p + r * dir
                        p = c + r * dir
                        return <circle cx={C[0] + R * sin(c)} cy={C[1] - R * cos(c)} r={R * sin(r)} key={i} />
                    })
                }</g>
                <g>{
                    data.self.map((v, i) => {
                        let arc = v.weight / sum, r = arc * PI, c = _p - r * dir
                        _p = c - r * dir
                        return <circle cx={C[0] + R * sin(c)} cy={C[1] - R * cos(c)} r={R * sin(r)} key={i} />
                    })
                }</g>
                <g>{

                }</g>
            </g>
        )
    }
    Links(type = 'from') {
        const { sum } = this.props, data = this.props[type]
    }

    handleResetState() {

    }
    handleHoverNode(e) {

    }
    handleHoverLink(e) {

    }

    render() {
        return (
            <g>
                {this.Nodes()}
            </g>
        )
    }
}
