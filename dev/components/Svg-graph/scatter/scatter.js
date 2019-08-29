import React, { Component } from 'react'

import style from './scatter.css'

export default class Scatter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0
        }
        this._Axis = this.Axis()
        this._Nodes = this.Nodes()
    }

    Axis() {
        const { that, datas } = this.props
        let xBase = 0
        return (
            <g>{datas.map(({ year, range }, i) => {
                range.xBase = xBase
                const o = [xBase + range.x.v, range.y.v * 12],
                    x0 = xBase + range.x.v * 12, y0 = range.y.v,
                    x1 = xBase + range.x.v * 1.5, y1 = range.y.v * 11.5,
                    x2 = xBase + range.x.v * 11.5, y2 = range.y.v * 1.5
                xBase += 10000 //range.w
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
                        <text x={xBase + range.x.v * 6.5} y={range.y.v * 0.5}>{year}</text>
                    </g>
                )
            })}</g>
        )
    }
    Nodes() {
        const { that, datas } = this.props
        return (
            <g>{datas.map(({ nodes, range }, i) => {
                const o = [range.xBase + range.x.v * 1.5, range.y.v * 11.5]
                return (
                    <g className={style.nodes} onMouseOver={this.handleHoverNode.bind(this)}>
                        {nodes.map((v, i) => {
                            const x = o[0] + (v.weight - range.x[0]) * 10, y = o[1] - (v.height - range.y[0]) * 10
                            return <circle name={JSON.stringify({ x, y })} fill={v.gender}
                                cx={x} cy={y} r='30' key={i} />
                        })}
                    </g>
                )
            })}</g>
        )
    }
    Infos() {
        const { state, props } = this, { datas } = props, range = props.datas[state.index].range,
            o = [range.xBase + range.x.v, range.y.v * 12],
            x1 = range.xBase + range.x.v * 1.5, y1 = range.y.v * 11.5,
            x2 = range.xBase + range.x.v * 11.5, y2 = range.y.v * 1.5
        let w, h
        if (state.x) {
            w = (state.x - x1) / 10 + range.x[0]
            h = (y1 - state.y) / 10 + range.y[0]
        }
        return (
            <g className={style.infos}>
                <g>
                    <line x1={x1} y1={o[1]} x2={x1} y2={o[1] + 30} />
                    <text x={x1} y={o[1] + 50}>{range.x[0].toFixed(2)}</text>
                    <line x1={x2} y1={o[1]} x2={x2} y2={o[1] + 30} />
                    <text x={x2} y={o[1] + 50}>{range.x[1].toFixed(2)}</text>
                    {state.x ?
                        <g>
                            <line x1={state.x} y1={o[1]} x2={state.x} y2={o[1] + 30} />
                            <text x={state.x} y={o[1] + 50}>{w.toFixed(2)}</text>
                            <path d={`M${o[0]} ${state.y} H${state.x} V${o[1]}`} />
                        </g> : null}
                </g>
                <g>
                    <line x1={o[0]} y1={y1} x2={o[0] - 30} y2={y1} />
                    <text x={o[0] - 60} y={y1}>{range.y[0].toFixed(2)}</text>
                    <line x1={o[0]} y1={y2} x2={o[0] - 30} y2={y2} />
                    <text x={o[0] - 60} y={y2}>{range.y[1].toFixed(2)}</text>
                    {state.y ?
                        <g>
                            <line x1={o[0]} y1={state.y} x2={o[0] - 30} y2={state.y} />
                            <text x={o[0] - 60} y={state.y}>{h.toFixed(2)}</text>
                        </g> : null}
                </g>
            </g>
        )
    }

    handleHoverNode(e) {
        this.setState(JSON.parse(e.target.getAttribute('name')))
    }

    render() {
        const { state, props } = this
        const { datas } = props, x = datas[state.index].range.xBase,
            w = datas[state.index].range.w, h = datas[state.index].range.h
        return (
            <svg viewBox={`${x} 0 ${w} ${h}`} preserveAspectRatio='xMinYMin meet'
                onWheel={e => {
                    let i = (e.deltaY < 0 ? -1 : 1) + state.index
                    i < 0 && (i = 0)
                    i >= datas.length && (i = datas.length - 1)
                    this.setState({ index: i })
                }}
            >
                {this.Infos()}
                {this._Axis}
                {this._Nodes}
            </svg>
        )
    }
}
