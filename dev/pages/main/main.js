import React, { Component } from 'react'
import { Route, Link, Switch } from "react-router-dom"

import Header from '../../components/header/header'
import Sider from '../../components/sider/sider'
import NewBuilt from '../../components/new-built/new-built'
import Projects from '../../components/projects/projects'
import User from '../../components/user/user'
import ProjectDetail from '../../components/project-detail/project-detail'
import ModelDetail from '../../components/model-detail/model-detail'

import SvgGraph from '../../components/Svg-graph/graph'

import style from './main.css'

import { ClassNames } from '../../util'
import SankeyData from '../../../static/test.json'
import CircularData from '../../../static/source.json'
import ScatterData from '../../../static/zp.json'
import CircleFlowData from '../../../static/circle-flow.json'

export default class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { state } = this
        return (
            <div className={ClassNames(style.main)} onClick={e => this.state.tabOn && this.setState({ tabOn: false })}>
                <Header handleClickTab={() => this.setState({ tabOn: true })} handleClickUser={userOn => this.setState({ userOn })} />
                <User active={state.userOn} />
                <Sider active={state.tabOn} />
                <Switch>
                    <Route path='/' exact>
                        <Route path='/' render={() => <NewBuilt />} />
                        <Route path='/' render={() => <Projects />} />
                    </Route>
                    <Route path='/project/:id' component={ProjectDetail} />
                    <Route path='/model/:id' component={ModelDetail} />
                </Switch>
            </div>
        )
    }
}
