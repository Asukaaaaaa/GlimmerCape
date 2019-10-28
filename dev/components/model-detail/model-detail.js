import React, { Component } from 'react'

import { Tabs, Icon, Button, Steps, Spin } from 'antd'
const { TabPane } = Tabs, { Step } = Steps

import Table, { Column } from '../table/table'
import Charts from '../charts/charts'
import SvgGraph from '../Svg-graph/graph'

import { host } from '../../util'
import style from './model-detail.css'
import ClusterData from '../../../static/cluster.json'

const MainView = ({ setCtx, group }) => {
    const names = Object.keys(viewData.MainView[2][0])
    names.splice(names.findIndex(v => v === 'words'), 1)
    return (
        <div className={style.container}>
            <div className={style.graph}>
                <SvgGraph graph='sankey' data={viewData.MainView[1]} setCtx={setCtx} />
            </div>
            <div className={style.right}>
                <Charts type='radar' width='400' height='300' data={viewData.MainView[0]} />
                <Table className={style.table} data={viewData.MainView[2]}>
                    <Column width='30%' title="词汇" dataIndex="word" key="-1" />
                    {names.map((v, i) => (
                        <Column title={v} dataIndex={v} key={i}
                            sorter={(a, b) => b[v] - a[v]} />
                    ))}
                </Table>
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
    const data = viewData.ClusterView
    return (
        <div className={style.container}>
            <div className={style.graph}>
                {
                    //<SvgGraph graph='circular' data={data.cluster_nodes} _data={viewData.MainView[1]} />
                }
            </div>
            <div className={style.right}>
                <div className={style.cinfo}>
                    <div>
                        <Icon type='bar-chart' />
                        <span>{data.cluster_name}</span>
                    </div>
                    <div className={style.c2}>
                        <div>节点数<span>{data.cluster_nodesnum}</span></div>
                        <div>边数<span>{data.cluster_edgesnum}</span></div>
                    </div>
                    <div className={style.c2}>
                        <div>平均度<span>{data.cluster_avdegree}</span></div>
                        <div>最大度<span>{data.cluster_maxdegree}</span></div>
                    </div>
                </div>
                {/*<div style={{ display: 'flex' }} >
                    <div style={{ marginRight: '50px' }}>
                        <div><span>年份</span></div>
                        <div><span>节点数</span></div>
                        <div><span>边数</span></div>
                        <div><span>密度</span></div>
                        <div><span>平均度</span></div>
                        <div><span>最大度</span></div>
                    </div>
                    <div style={{ fontWeight: 'bold' }}>
                        <div><span>{data.label}</span></div>
                        <div><span>{data.cluster_density}</span></div>
                    </div>
            </div>*/}
                <Table data={viewData.ClusterView.cluster_nodes}>
                    <Column width='30%' title="词汇" dataIndex="key" key="key" />
                    <Column title="Z-value" dataIndex="z_value" key="z_value"
                        sorter={(a, b) => b.z_value - a.z_value} />
                    <Column title="P-value" dataIndex="p_value" key="p_value"
                        sorter={(a, b) => b.p_value - a.p_value} />
                    <Column title="词频" dataIndex="weight" key="weight"
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
                        label: obj.year || this.state.group
                    }, res => {
                        if (res.resultDesc === 'Success') {
                            viewData.ClusterView = JSON.parse(res.data)
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
