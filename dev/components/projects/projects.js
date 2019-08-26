import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import style from './projects.css'

class Projects extends Component {
    constructor(props) {
        super(props)
    }

    Blocks({ data }) {
        return (
            <div className={style.blocks}>{
                data.map((v, i) => (
                    <div onClick={e => this.props.history.push(`/project/${0}`)} key={i}>
                        <div>
                            简介
                        </div>
                        <div>
                            <span>name</span>
                            <span>time</span>
                        </div>
                        <div>
                            <span>id</span>
                            <span>time1</span>
                        </div>
                    </div>
                ))
            }</div>
        )
    }

    render() {
        const Blocks = this.Blocks.bind(this)

        return (
            <div className={style.main}>
                <div className={style.title}>
                    <span>我的项目</span>
                </div>
                <Blocks data={new Array(4).fill(0)} />
                <Blocks data={new Array(2).fill(0)} />
            </div>
        )
    }
}

export default withRouter(Projects)