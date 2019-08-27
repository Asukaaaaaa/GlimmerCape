import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { host } from '../../util'
import style from './projects.css'

class Projects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{}]
        }
        this.update()
    }

    update() {
        fetch(host + '/project/getProjectList', {
            method: 'POST',
            body: {
                user_id: window.user_id,
                page_num: 5,
                page_size: 4
            }
        }).then(r => r.json()).then(res => {
            if (res.resultDesc === 'Success') {
                this.setState({ data: res.list })
            }
        })
    }
    componentWillReceiveProps() {
        this.update()
    }

    Blocks({ data }) {
        return (
            <div className={style.blocks}>{
                data.map((v, i) => (
                    <div onClick={e => this.props.history.push(`/project/${0}`)} key={i}>
                        <div>{v.projectDesc}</div>
                        <div>
                            <span>{v.projectName}</span>
                            <span>{new Date(v.createTime).toLocaleString()}</span>
                        </div>
                        <div>
                            <span>{v.projectId}</span>
                            <span>{new Date(v.modifyTime).toLocaleString()}</span>
                        </div>
                    </div>
                ))
            }</div>
        )
    }

    render() {
        const Blocks = this.Blocks.bind(this),
            dataGroups = this.state.data.reduce((acc, v, i) => {
                const j = Math.floor(i / 4)
                acc[j] || (acc[j] = [])
                acc[j].push(v)
                return acc
            }, [])
        return (
            <div className={style.main}>
                <div className={style.title}>
                    <span>我的项目</span>
                </div>
                {dataGroups.map((v, i) => <Blocks data={v} key={i} />)}
            </div>
        )
    }
}

export default withRouter(Projects)