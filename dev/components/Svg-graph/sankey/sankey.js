import React, { Component, useState } from 'react'

import style from './sankey.css'

import { ClassNames, BaseColor, NormalColor, ExtendColor } from '../../../util'
import { Svg } from '../graph'


const Block = ({ inactive, rect, info, color }) => (
    <g className={ClassNames(inactive && style.inactive)} name={JSON.stringify({ src: info, fill: color })}>
        <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill={color}></rect>
        <text x={rect.x + rect.w + 20} y={rect.y + rect.h / 2}>{info.name}</text>
    </g>
)
const Belt = ({ inactive, src, tar, info, color }) => {
    const { x1, y1, h1 } = src, { x2, y2, h2 } = tar
    info.fill = color
    return <path className={ClassNames(inactive && style.inactive)} name={JSON.stringify(info)} d={`M${x1} ${y1} Q${(3 * x1 + x2) / 4} ${y1} ${(x1 + x2) / 2} ${(y1 + y2) / 2} T${x2} ${y2} V${y2 + h2} Q${(x1 + 3 * x2) / 4} ${y2 + h2} ${(x1 + x2) / 2} ${(y1 + h1 + y2 + h2) / 2} T${x1} ${y1 + h1} V${y2} Z`} key={`${x1}${y1}${x2}${y2}`} fill={color}></path>
}

export default class Sankey extends Component {
    Head() {
        const { minYear, maxYear, piece } = this.props
        const res = []
        for (let i = minYear; i <= maxYear; ++i) {
            res.push(
                <g key={i}>
                    <rect x={piece * (i - minYear) + 10} y='0' width={piece - 20} height='200' value={'' + i}></rect>
                    <text x={piece * (i - minYear + 0.5)} y='100'>{i}</text>
                </g>
            )
        }
        return res
    }
    Blocks() {
        const { nodes, minYear, blocks, piece, gap, maxValue } = this.props
        return blocks.map((col, i) => {
            let y = 200 + gap
            return (
                <g key={i}>{
                    col.map((block, j) => {
                        const node = nodes[block.name]
                        const _rect = {
                            x: piece * i,
                            y: y,
                            w: 120,
                            h: 8600 * block.value / maxValue
                        }
                        const year = (minYear + i) + '', ls = node.links.find(l => l.year == minYear + i),
                            info = { name: block.name, year, id: ls.id, num: ls.num }
                        Object.assign(ls, _rect)
                        y += _rect.h + gap
                        return <Block inactive={!this.isActive(info)} rect={_rect} info={info} color={node.color} key={j} />
                    })}
                </g>
            )
        })
    }
    Belts() {
        const { nodes, minYear, blocks } = this.props
        const res = [], nodesBuff = {}
        for (let attr in nodes) {
            const node = nodes[attr]
            nodesBuff[attr] = node.links.map(l => ({ from: 0, to: 0 }))
        }
        blocks.forEach((col, i) => {
            col.forEach(b => {
                const s_node = nodes[b.name], year = (minYear + i) + ''
                let index = s_node.links.findIndex(v => v.year === year)
                const src = s_node.links[index], s_buff = nodesBuff[b.name][index]
                src.to.forEach(l => {
                    const t_node = nodes[l.name]
                    index = t_node.links.findIndex(v => v.year === l.year)
                    const tar = t_node.links[index], t_buff = nodesBuff[l.name][index]
                    const info = {
                        src: {
                            name: b.name,
                            year: year
                        },
                        tar: {
                            name: l.name,
                            year: l.year
                        },
                        value: l.value
                    }
                    const x1 = src.x + src.w, y1 = src.y + src.h * s_buff.to / src.value, h1 = src.h * l.value / src.value
                    const x2 = tar.x, y2 = tar.y + tar.h * t_buff.from / tar.value, h2 = tar.h * l.value / tar.value
                    const path = <Belt
                        inactive={!this.isActive(info.src, info.tar)}
                        src={{ x1, y1, h1 }} tar={{ x2, y2, h2 }} info={info} color={s_node.color} key={`${x1}${y1}${x2}${y2}`} />
                    res.push(path)
                    s_buff.to += l.value
                    t_buff.from += l.value
                })
            })
        })
        return res
    }

    isActive(src, tar) {
        const state = this.props.that.state
        const comp = (a, b) => a.name === b.name && a.year === b.year
        if (state.active) {
            if (state.tar) {
                if (tar)
                    return comp(src, state.src) && comp(tar, state.tar)
                else
                    return comp(src, state.src) || comp(src, state.tar)
            } else {
                if (tar)
                    return src.name === state.src.name || tar.name === state.src.name
                else
                    return src.name === state.src.name
            }

        }
        return true
    }
    handleResetState() {
        this.setState({ active: false, src: null, tar: null })
    }
    handleClickBlock(e) {
        const { that, nodes } = this.props, info = JSON.parse(e.target.parentNode.getAttribute('name')).src
        that.props.setCtx({ cluster: info }, 'PickCluster')
    }
    handleHoverBlock(e) {
        this.setState({
            active: 'node',
            ...JSON.parse(e.target.parentNode.getAttribute('name'))
        })
    }
    handleOutBlock(e) {
    }
    handleHoverBelt(e) {
        this.setState({
            active: 'link',
            ...JSON.parse(e.target.getAttribute('name'))
        })
    }
    handleOutBelt(e) {
    }

    render() {
        const that = this.props.that
        const Head = this.Head(), Blocks = this.Blocks(), Belts = this.Belts()
        return (
            <Svg viewBox='0 0 20000 10000' preserveAspectRatio='xMinYMin meet'>
                <g className={style.head}
                    onClick={e => {
                        const v = e.target.getAttribute('value')
                        v && this.props.that.props.setCtx({ group: v }, 'SetGroup')
                    }}>
                    {Head}
                </g>
                <g className={style.belts} onMouseOver={this.handleHoverBelt.bind(that)} onMouseOut={this.handleResetState.bind(that)}>{Belts}</g>
                <g className={style.blocks} onClick={this.handleClickBlock.bind(this)} onMouseOver={this.handleHoverBlock.bind(that)} onMouseOut={this.handleResetState.bind(that)}>{Blocks}</g>
            </Svg>
        )
    }
}