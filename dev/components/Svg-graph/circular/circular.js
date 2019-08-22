import React, { Component } from 'react'

import style from './circular.css'

import { BaseColor, NormalColor, ExtendColor, ClassNames } from '../../../util'


const { cos, sin, PI } = Math

export default class circular extends Component {
    isActive(src, tar) {
        const state = this.props.that.state
        const comp = (a, b) => a.name === b.name && a.year === b.year
        if (state.active) {
            if (state.active === 'node-group') {
                return tar ? tar.name === state.src.name : false
            } else if (state.active === 'node-single') {
                return tar ? comp(tar, state.src) : false
            } else if (state.active === 'link') {
                return tar ? comp(src, state.src) && comp(tar, state.tar) : comp(src, state.src) || comp(src, state.tar)
            }
        }
        return false
    }
    Nodes(node) {
        const { r } = this.props
        const { arc, value } = node, size = node.links.length, peri = arc.v * 11 / 12
        const arcs = node.links.map(ls => {
            const v = ls.from / (value || 1) * peri
            return v > PI / 6 ? PI / 6 : v
        })
        const gap = arcs.reduce((acc, v, i) => acc + v, 0) / 12 / (size + 1)
        let p = arc.start + gap
        const res = []
        arcs.forEach((a, i) => {
            let _r = r * a / 2, cp = p + a / 2
            const _x = 7500 + r * sin(cp), _y = 7500 - r * cos(cp)
            const fx = _x + (_r + 66) * sin(cp), fy = _y - (_r + 66) * cos(cp)
            res.push(
                <g className={this.isActive({ name: node.name, year: node.links[i].year }) ? style.active : ''}
                    name={JSON.stringify({ type: 'node-single', year: node.links[i].year, value })} key={i}>
                    <circle cx={_x} cy={_y} r={_r} fill={node.color} ></circle>
                    <text x={fx} y={fy} fontSize={(1 - PI / (PI + 36 * a)) * 200} transform={`rotate(${180 * cp / PI - 90}, ${fx}, ${fy})`} fill={node.color}>{node.links[i].year}</text>
                </g>
            )
            node.links[i].x = _x, node.links[i].y = _y, node.links[i].r = _r
            p += a + gap
        })
        let cp = arc.start + arc.v / 2, _r = r + 1200
        const fx = 7500 + _r * sin(cp), fy = 7500 - _r * cos(cp)
        res.push(<text x={fx} y={fy} fontSize={(1 - PI / (PI + 36 * arc.v)) * 400} transform={`rotate(${180 * cp / PI - 90}, ${fx}, ${fy})`} fill={node.color} key={node.links.length}>{node.name}</text>)
        return res
    }
    Links(links) {
        const { that, nodes, linkMax } = this.props
        return links.map((l, i) => {
            const info = {
                src: { name: l.source, year: l.sourcegroup },
                tar: { name: l.target, year: l.targetgroup },
                value: l.value
            }
            const s_node = nodes[l.source], t_node = nodes[l.target]
            const src = s_node.links.find(ls => ls.year === l.sourcegroup), tar = t_node.links.find(ls => ls.year === l.targetgroup)
            return <path className={this.isActive(info.src, info.tar) ? style.active : ''} name={JSON.stringify(info)}
                d={`M${src.x} ${src.y} Q7500 7500 ${tar.x} ${tar.y}`} stroke={s_node.color} strokeWidth={l.value / linkMax * 45 + 5} key={i}></path>
        })
    }
    handleResetState() {
        this.setState({ active: null, src: null, tar: null })
    }
    handleHoverNode(e) {
        const info = JSON.parse(e.target.parentNode.getAttribute('name'))
        if (info.type === 'node-group') {
            //
        } else if (info.type === 'node-single') {
            info.name = JSON.parse(e.target.parentNode.parentNode.getAttribute('name')).name
        }
        this.setState({
            active: info.type,
            src: { name: info.name, year: info.year },
            value: info.value
        })
    }
    handleOutNode(e) {

    }
    handleHoverLink(e) {
        const info = JSON.parse(e.target.getAttribute('name'))
        this.setState({
            active: 'link',
            src: info.src,
            tar: info.tar,
            value: info.value
        })
    }
    handleOutLink(e) {

    }

    render() {
        const { that, nodes, links } = this.props

        const Nodes = []
        let i = 0
        for (const attr in nodes) {
            const node = nodes[attr]
            Nodes.push(
                <g name={JSON.stringify({ type: 'node-group', name: node.name, value: node.value })} key={i++}>
                    {this.Nodes(node)}
                </g>)
        }
        const Links = this.Links(links)
        return (
            <g className={style[`active-${that.state.active}`]}>
                <g className={style.links} onMouseOver={this.handleHoverLink.bind(that)} onMouseOut={this.handleResetState.bind(that)}>{Links}</g>
                <g className={style.nodes} onMouseOver={this.handleHoverNode.bind(that)} onMouseOut={this.handleResetState.bind(that)}>{Nodes}</g>
            </g>
        )
    }
}
