import React, { Component } from 'react'

import Sankey from '../../components/sankey/sankey'

import style from './main.css'

import { ClassNames } from '../../util'


/**
 * test data
 */
const data = { "nodes": [{ "name": "2013" }, { "name": "2013_information system" }, { "name": "2013_bibliometric" }, { "name": "2013_academic library" }, { "name": "2013_knowledge management" }, { "name": "2013_local loop unbundeling" }, { "name": "2013_human" }, { "name": "2013_social media" }, { "name": "2013_gis" }, { "name": "2013_open access" }, { "name": "2014" }, { "name": "2014_bibliometric" }, { "name": "2014_academic library" }, { "name": "2014_develop country" }, { "name": "2014_knowledge sharing" }, { "name": "2014_human" }, { "name": "2014_information system" }, { "name": "2014_life science" }, { "name": "2014_qualitative analysis" }, { "name": "2014_cellular automata" }, { "name": "2014_ciencias juridicas" }, { "name": "2014_democracy" }, { "name": "2014_generalize poisson regression" }, { "name": "2014_name entity recognition" }, { "name": "2015" }, { "name": "2015_bibliometric" }, { "name": "2015_knowledge management" }, { "name": "2015_academic library" }, { "name": "2015_human" }, { "name": "2015_information system" }, { "name": "2015_safety" }, { "name": "2015_open access" }, { "name": "2016" }, { "name": "2016_qualitative" }, { "name": "2016_bibliometric" }, { "name": "2016_academic library" }, { "name": "2016_knowledge management" }, { "name": "2016_info eu repo semantics article" }, { "name": "2016_human factor" }, { "name": "2016_human" }, { "name": "2016_develop country" }, { "name": "2016_information security" }, { "name": "2017" }, { "name": "2017_bibliometric" }, { "name": "2017_knowledge management" }, { "name": "2017_qualitative" }, { "name": "2017_information literacy" }, { "name": "2017_research qualitative" }, { "name": "2017_scientific production" }, { "name": "2017_mendeley" }, { "name": "2017_information system" }], "links": [{ "source": "2013_information system", "value": 137.73342169895912, "target": "2014_information system" }, { "source": "2013_bibliometric", "value": 109.58637090171923, "target": "2014_bibliometric" }, { "source": "2013_academic library", "value": 218.66593894974852, "target": "2014_academic library" }, { "source": "2013_academic library", "value": 5.691785895286733, "target": "2014_ciencias juridicas" }, { "source": "2013_knowledge management", "value": 78.78835133133211, "target": "2014_knowledge sharing" }, { "source": "2013_local loop unbundeling", "value": 0.42883318389146624, "target": "2014_generalize poisson regression" }, { "source": "2013_human", "value": 53.44820864683638, "target": "2014_develop country" }, { "source": "2013_human", "value": 123.30903278624615, "target": "2014_human" }, { "source": "2013_human", "value": 49.35480098241784, "target": "2014_qualitative analysis" }, { "source": "2013_human", "value": 0.42883318389146624, "target": "2014_name entity recognition" }, { "source": "2013_social media", "value": 1.0915753771782775, "target": "2014_democracy" }, { "source": "2013_gis", "value": 0.8576663677829325, "target": "2014_cellular automata" }, { "source": "2013_open access", "value": 46.976726053565166, "target": "2014_life science" }, { "source": "2013", "value": 0, "target": "2014" }, { "source": "2014_bibliometric", "value": 0, "target": "2015" }, { "source": "2014_academic library", "value": 212.58794447613616, "target": "2015_academic library" }, { "source": "2014_develop country", "value": 80.39551245483932, "target": "2015_human" }, { "source": "2014_knowledge sharing", "value": 54.91538315269062, "target": "2015_knowledge management" }, { "source": "2014_human", "value": 0, "target": "2015" }, { "source": "2014_information system", "value": 137.21239779425744, "target": "2015_information system" }, { "source": "2014_life science", "value": 61.380490587564175, "target": "2015_open access" }, { "source": "2014_qualitative analysis", "value": 61.53261076250237, "target": "2015_safety" }, { "source": "2014_cellular automata", "value": 0, "target": "2015" }, { "source": "2014_ciencias juridicas", "value": 0, "target": "2015" }, { "source": "2014_democracy", "value": 0, "target": "2015" }, { "source": "2014_generalize poisson regression", "value": 0, "target": "2015" }, { "source": "2014_name entity recognition", "value": 0, "target": "2015" }, { "source": "2014", "value": 0, "target": "2015" }, { "source": "2014", "value": 0, "target": "2015_bibliometric" }, { "source": "2015_bibliometric", "value": 127.35341002111068, "target": "2016_bibliometric" }, { "source": "2015_knowledge management", "value": 62.298048339149545, "target": "2016_knowledge management" }, { "source": "2015_academic library", "value": 180.13011072336394, "target": "2016_academic library" }, { "source": "2015_human", "value": 18.74111412692258, "target": "2016_human" }, { "source": "2015_human", "value": 51.95812330360605, "target": "2016_develop country" }, { "source": "2015_information system", "value": 98.44470294257033, "target": "2016_information security" }, { "source": "2015_safety", "value": 31.364439274481924, "target": "2016_human factor" }, { "source": "2015_open access", "value": 134.37594244108396, "target": "2016_qualitative" }, { "source": "2015", "value": 0, "target": "2016" }, { "source": "2016_qualitative", "value": 125.71269642608817, "target": "2017_qualitative" }, { "source": "2016_qualitative", "value": 11.12501738283966, "target": "2017_research qualitative" }, { "source": "2016_bibliometric", "value": 95.67514949242107, "target": "2017_bibliometric" }, { "source": "2016_bibliometric", "value": 1.807815324711445, "target": "2017_mendeley" }, { "source": "2016_academic library", "value": 73.28605200945626, "target": "2017_information literacy" }, { "source": "2016_knowledge management", "value": 27.673480739813655, "target": "2017_knowledge management" }, { "source": "2015", "value": 0, "target": "2016_info eu repo semantics article" }, { "source": "2016_info eu repo semantics article", "value": 4.5890696704213605, "target": "2017_scientific production" }, { "source": "2016_human factor", "value": 0, "target": "2017" }, { "source": "2016_human", "value": 0, "target": "2017" }, { "source": "2016_develop country", "value": 0, "target": "2017" }, { "source": "2016_information security", "value": 75.5110554860242, "target": "2017_information system" }, { "source": "2016", "value": 0, "target": "2017" }] }
const getMax = (...args) => args.reduce((acc, v, i) => v > (acc || v) ? v : acc || v, null)
const getMin = (...args) => args.reduce((acc, v, i) => v < (acc || v) ? v : acc || v, null)
const makeNode = (name) => ({
    name,
    links: []
})
const nodes = {}
let minYear, maxYear
data.nodes.forEach(n => {
    const names = n.name.split('_')
    let year = Number.parseInt(names[0])
    minYear = getMin(minYear, year)
    maxYear = getMax(maxYear, year)
    if (names[1]) {
        const node = nodes[names[1]] || makeNode(names[1])
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
    if (source[1]) {
        nodes[source[1]].links.find(l => l.year === source[0]).to.push({
            year: target[0],
            name: target[1],
            value: l.value
        })
    }
    if (target[1]) {
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

/**********************/

export default class Main extends Component {
    render() {
        return (
            <div className={ClassNames(style.main)}>
                <Sankey nodes={nodes} minYear={minYear} maxYear={maxYear} />
            </div>
        )
    }
}
