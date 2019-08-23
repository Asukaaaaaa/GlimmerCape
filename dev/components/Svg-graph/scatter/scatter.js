import React, { Component } from 'react'

import style from './scatter.css'

export default class Scatter extends Component {
    constructor(props) {
        super(props)

        this._Nodes = this.Nodes()
    }
    Axis() {
        const { that, range } = this.props
        const o = [range.x.v, range.y.v * 12],
            x0 = range.x.v * 12, y0 = range.y.v,
            x1 = range.x.v * 1.5, y1 = range.y.v * 11.5,
            x2 = range.x.v * 11.5, y2 = range.y.v * 1.5
        let w, h
        if (that.state.x) {
            w = (that.state.x - x1) / 10 + range.x[0]
            h = (y1 - that.state.y) / 10 + range.y[0]
        }
        return (
            <g className={style.axis}>
                <g>{new Array(6).fill(0).map((v, i) => {
                    const y = y0 + range.y.v * 11 / 5 * i
                    return <line x1={o[0]} y1={y} x2={x0} y2={y} key={i} />
                })}</g>
                <g>{new Array(6).fill(0).map((v, i) => {
                    const x = x0 - range.x.v * 11 / 5 * i
                    return <line x1={x} y1={o[1]} x2={x} y2={y0} key={i} />
                })}</g>
                <polygon points={`${o[0] + 30} ${y0} ${o[0]} ${y0 - 50} ${o[0] - 30} ${y0}`} />
                <polygon points={`${x0} ${o[1] + 30} ${x0 + 50} ${o[1]} ${x0} ${o[1] - 30}`} />
                <g>
                    <g>
                        <line x1={x1} y1={o[1]} x2={x1} y2={o[1] + 30} />
                        <text x={x1} y={o[1] + 50}>{range.x[0].toFixed(2)}</text>
                        <line x1={x2} y1={o[1]} x2={x2} y2={o[1] + 30} />
                        <text x={x2} y={o[1] + 50}>{range.x[1].toFixed(2)}</text>
                        {that.state.x ?
                            <g>
                                <line x1={that.state.x} y1={o[1]} x2={that.state.x} y2={o[1] + 30} />
                                <text x={that.state.x} y={o[1] + 50}>{w.toFixed(2)}</text>
                                <path d={`M${o[0]} ${that.state.y} H${that.state.x} V${o[1]}`} />
                            </g> : null}
                    </g>
                    <g>
                        <line x1={o[0]} y1={y1} x2={o[0] - 30} y2={y1} />
                        <text x={o[0] - 60} y={y1}>{range.y[0].toFixed(2)}</text>
                        <line x1={o[0]} y1={y2} x2={o[0] - 30} y2={y2} />
                        <text x={o[0] - 60} y={y2}>{range.y[1].toFixed(2)}</text>
                        {that.state.y ?
                            <g>
                                <line x1={o[0]} y1={that.state.y} x2={o[0] - 30} y2={that.state.y} />
                                <text x={o[0] - 60} y={that.state.y}>{h.toFixed(2)}</text>
                            </g> : null}
                    </g>
                </g>
            </g>
        )
    }
    Nodes() {
        const { that, nodes, range } = this.props
        const o = [range.x.v * 1.5, range.y.v * 11.5]
        return (
            <g className={style.nodes} onMouseOver={this.handleHoverNode.bind(that)} onMouseOut={this.handleResetState.bind(that)}>
                {nodes.map((v, i) => {
                    const x = o[0] + (v.weight - range.x[0]) * 10, y = o[1] - (v.height - range.y[0]) * 10
                    return <circle name={JSON.stringify({ x, y })}
                        cx={x} cy={y} r='30' key={i} />
                })}
            </g>
        )
    }

    handleResetState() {
        this.setState({ x: null, y: null })
    }
    handleHoverNode(e) {
        this.setState(JSON.parse(e.target.getAttribute('name')))
    }

    render() {
        const Axis = this.Axis(), Nodes = this._Nodes
        return (
            <g>
                {Axis}
                {Nodes}
            </g>
        )
    }
}
