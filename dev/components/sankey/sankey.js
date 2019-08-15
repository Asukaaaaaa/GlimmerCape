import React from 'react'

import style from './sankey.css'


// head
const Head = (min, max) => {
    const res = [], piece = 10000 / (max - min + 1)
    for (let i = min; i <= max; ++i) {
        res.push(
            <g key={i}>
                <rect x={piece * (i - min)} y='0' width={piece - 20} height='200'></rect>
                <text x={piece * (i - min + 0.5)} y='100'>{i}</text>
            </g>
        )
    }
    return res
}

const Node = node => {

}

export default ({ nodes, minYear, maxYear }) => {
    const values = new Array(maxYear - minYear + 1).fill(0)
    for (let attr in nodes) {
        const n = nodes[attr]
        n.links.forEach(l => values[Number.parseInt(l.year) - minYear] += l.value)
    }
    return (
        <div>
            <svg className={style.main} viewBox='0 0 10000 10000' preserveAspectRatio='xMidYMid meet'>
                <g className={style.head}>{Head(minYear, maxYear)}</g>
            </svg>
        </div>
    )
}