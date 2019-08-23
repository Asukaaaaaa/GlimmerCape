import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import SvgGraph from '../../components/Svg-graph/graph'
import Sankey from '../../components/Svg-graph/sankey/sankey'
import Circular from '../../components/Svg-graph/circular/circular'

import style from './main.css'

import { ClassNames } from '../../util'
import SankeyData from '../../../static/test.json'
import CircularData from '../../../static/source.json'
import ScatterData from '../../../static/zp.json'


export default class Main extends Component {
    constructor(props) {
        super(props)
        this.graphDatas = { 'sankey': SankeyData, 'circular': CircularData, 'scatter': ScatterData }
        this.state = {
            graph: 'scatter'
        }
    }

    render() {
        const { state } = this
        return (
            <div className={ClassNames(style.main)}>
                <a href='#' onClick={() => this.setState({ graph: 'sankey' })}>Sankey</a>
                <a href='#' onClick={() => this.setState({ graph: 'circular' })}>Circular</a>
                <a href='#' onClick={() => this.setState({ graph: 'scatter' })}>Scatter</a>
                <SvgGraph graph={state.graph} data={this.graphDatas[state.graph]} />
            </div>
        )
    }
}
