import React, { Component } from 'react'

import { Tabs, Table, Icon, Button, Steps, Spin } from 'antd'
const { TabPane } = Tabs, { Column } = Table, { Step } = Steps

import Charts from '../charts/charts'
import SvgGraph from '../Svg-graph/graph'

import { host } from '../../util'
import style from './model-detail.css'
import ClusterData from '../../../static/cluster.json'

const MainView = ({ setCtx, group }) => {
    return (
        <div className={style.container}>
            <div className={style.graph}>
                <SvgGraph graph='sankey' data={viewData.MainView[1]} setCtx={setCtx} />
            </div>
            <div className={style.right}>
                <Charts type='radar' width='400' height='300' data={viewData.MainView[0]} />
                <div className={style.table}>
                    <Table dataSource={null} bordered pagination={false} scroll={{ y: 300 }}>
                        <Column width='30%' title="词汇" dataIndex="word" key="0"
                            render={(text, record) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>} />
                        <Column width='30%' title="2013" dataIndex="2013" key="1"
                            sorter={(a, b) => b['2013'] - a['2013']} />
                        <Column width='30%' title="2014" dataIndex="2014" key="2"
                            sorter={(a, b) => b['2014'] - a['2014']} />
                    </Table>
                </div>
            </div>
        </div>
    )
}
const GroupView = ({ group, setCtx }) => {
    return (
        <div className={style.container}>
            <div className={style.graph}>
                <Charts type='dbMap' width='1000' height='600' data={viewData.GroupView[0]} setCtx={setCtx} />
            </div>
            <div className={style.right}>
                <SvgGraph graph='scatter' data={[viewData.GroupView[1].find(v => v.label == group)]} />
            </div>
        </div>
    )
}
const ClusterView = ({ }) => {
    return (
        <div className={style.container}>
            <div className={style.graph}>
                <SvgGraph graph='circular' data={viewData.ClusterView.cluster_nodes} _data={viewData.MainView[1]} />
            </div>
            <div className={style.right}>
                <div>
                    <Icon type='bar-chart' />
                    <span>社区信息</span>
                </div>
                <div><span>年份</span></div>
                <div><span>节点数</span></div>
                <div><span>边数</span></div>
                <div><span>密度</span></div>
                <div><span>平均度</span></div>
                <div><span>最大度</span></div>
                <Table dataSource={viewData.ClusterView.cluster_nodes} bordered pagination={false} scroll={{ y: 600 }}>
                    <Column width='30%' title="词汇" dataIndex="key" key="key"
                        render={(text, record) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>} />
                    <Column width='30%' title="Z-value" dataIndex="z_value" key="z_value"
                        render={(text, record) => <span>{record.z_value.toFixed(5) + '...'}</span>}
                        sorter={(a, b) => b.z_value - a.z_value} />
                    <Column width='30%' title="P-value" dataIndex="p_value" key="p_value"
                        render={(text, record) => <span>{record.p_value.toFixed(5) + '...'}</span>}
                        sorter={(a, b) => b.p_value - a.p_value} />
                    <Column width='10%' title="词频" dataIndex="weight" key="weight"
                        sorter={(a, b) => b.weight - a.weight} />
                </Table>
            </div>
        </div>
    )
}
const Loading = () => (
    <Spin className={style.loading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
)

const viewData = {}

export default class ModelDetail extends Component {
    constructor(props) {
        super(props)

        this.views = { MainView, GroupView, ClusterView, Loading }
        this.state = {
            on: 'MainView',
            mid: props.match.params.id,
            setCtx: ((obj, mode) => {
                if (mode === 'SetGroup') {
                    this.setState({
                        on: 'Loading',
                        ...obj
                    })
                    Promise.all([
                        new Promise((resolve, reject) => {
                            $.post(host + '/result/getGraphInfo', {
                                model_id: this.state.mid,
                                label: obj.group
                            }, res => {
                                if (res.resultDesc === 'Success') {
                                    fetch(host + res.data.split('Web_NEview')[1]).then(r => r.json()).catch(console.log).then(res => {
                                        resolve(res)
                                    })
                                }
                            })
                        }),
                        new Promise((resolve, reject) => {
                            $.post(host + '/result/getZpFile', {
                                model_id: this.state.mid
                            }, res => {
                                if (res.resultDesc === 'Success') {
                                    fetch(host + res.data.split('Web_NEview')[1]).then(r => r.json()).catch(console.log).then(res => {
                                        resolve(res)
                                    })
                                }
                            })
                        })]).then(val => {
                            viewData.GroupView = val
                            this.setState({ on: 'GroupView' })
                        })
                } else if (mode === 'GetCoword') {
                    // todo
                } else if (mode === 'GetCluster') { // todo
                    this.setState({ on: 'Loading' })
                    $.post(host + '/result/getPickedClusterInfo', {
                        model_id: this.state.mid,
                        cluster_id: obj.id,
                        label: this.state.group
                    }, res => {
                        if (res.resultDesc === 'Success') {
                            viewData.ClusterView = val
                            this.setState({ on: 'ClusterView' })
                        }
                    })
                }
            }).bind(this)
        }
    }
    componentDidMount() {
        this.setState({ on: 'Loading' })
        Promise.all([
            new Promise((resolve, reject) => {
                $.post(host + '/result/getRadarPath', {
                    model_id: this.state.mid
                }, res => {
                    if (res.resultDesc === 'Success') {
                        fetch(host + res.data.split('Web_NEview')[1]).then(r => r.json()).then(res => {
                            resolve(res)
                        })
                    }
                })
            }),
            new Promise((resolve, reject) => {
                $.post(host + '/result/getEvoFile', {
                    model_id: this.state.mid
                }, res => {
                    if (res.resultDesc === 'Success') {
                        fetch(host + res.data.split('Web_NEview')[1]).then(r => r.json()).then(res => {
                            resolve(res)
                        })
                    }
                })
            }),
            new Promise((resolve, reject) => {
                $.post(host + '/result/getCoword', {
                    model_id: this.state.mid,
                    // label: '2013'
                }, res => {
                    if (res.resultDesc === 'Success') {
                        fetch(host + res.data.split('Web_NEview')[1]).then(r => r.json()).then(res => {
                            resolve(res)
                        })
                    }
                })
            })]).then(val => {
                viewData.MainView = val
                this.setState({ on: 'MainView' })
            })
    }
    static getDerivedStateFromProps(props, state) {
        viewData[state.on] || (state.on = 'Loading')
        return state
    }

    render() {
        const steps = ['MainView', 'GroupView', 'ClusterView']
        return (
            <div className={style.main} >
                <Steps className={style.steps}
                    current={steps.indexOf(this.state.on)} onChange={s => this.setState({ on: steps[s] })}>
                    <Step title="Main" description="" />
                    <Step title="Group" description="" />
                    <Step title="Cluster" description="" />
                </Steps>
                {this.views[this.state.on](this.state, this)}
            </div >
        )
    }
}
