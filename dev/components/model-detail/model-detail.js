import React, { Component } from 'react'

import { Tabs, Table, Icon, Button, Steps } from 'antd'
const { TabPane } = Tabs, { Column } = Table, { Step } = Steps

import Charts from '../charts/charts'
import SvgGraph from '../Svg-graph/graph'

import { host } from '../../util'
import style from './model-detail.css'
import radarData from '../../../static/radar.json'
import forceData from '../../../static/2013.json'

const MainView = ({ mid, setCtx }) => {
    return (
        <div className={style.container}>
            <div className={style.graph}>
                <SvgGraph graph='sankey' data={viewData.MainView} setCtx={setCtx} />
            </div>
            <div className={style.right}>
                <Charts type='radar' width='400' height='300' data={radarData} />
            </div>
        </div>
    )
}
const GroupView = ({ mid, group, getClusterData }) => {
    return (
        <div className={style.container}>
            <div className={style.graph}>
                <Charts type='dbMap' width='1000' height='600' data={forceData} getClusterData={getClusterData} />
            </div>
            <div className={style.right}>
                <SvgGraph graph='scatter' data={[viewData.GroupView.find(v => v.label == group)]} />
            </div>
        </div>
    )
}
const ClusterView = ({ }) => {
    return (
        <div className={style.container}>
            <div className={style.graph}>
                <SvgGraph graph='circular' data={viewData.ClusterView} _data={viewData.MainView} />
            </div>
            <div className={style.right}>
                {/*<div className={style.table}>
                    <div>
                        <Icon type='bar-chart' />
                        <span>社区信息</span>
                    </div>
                    <Table dataSource={state.clusterData} bordered pagination={false} scroll={{ y: 480 }}
                        title={() => (
                            <div className={style['t-head']}>
                                <div className={style['t-head-left']}>
                                    <div>{state.node.name}</div>
                                    <div>{state.node.year}</div>
                                    <div>{state.node.num}</div>
                                </div>
                                <div className={style['t-head-right']}>
                                    <a download={`${state.node.year}_${state.node.name}`}
                                        href={`${host}/result/ExportClusterInfo?model_id=${this.props.match.params.id}&cluster_id=${state.node.id}&label=${state.node.year}`}>
                                        <Button type="primary" shape="round" icon="download" disabled={!state.node.name}>
                                            导出社区信息
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        )}>
                        <Column width='25%' title="词汇" dataIndex="key" key="key"
                            render={(text, record) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>} />
                        <Column width='30%' title="Z-value" dataIndex="z_value" key="z_value"
                            render={(text, record) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>}
                            sorter={(a, b) => b.z_value - a.z_value} />
                        <Column width='30%' title="P-value" dataIndex="p_value" key="p_value"
                            render={(text, record) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>}
                            sorter={(a, b) => b.p_value - a.p_value} />
                        <Column title="词频" dataIndex="weight" key="weight"
                            sorter={(a, b) => b.weight - a.weight} />
                    </Table>
                        </div>*/}
            </div>
        </div>
    )
}
const Loading = () => (
    <div>

    </div>
)

const viewData = {}

export default class ModelDetail extends Component {
    constructor(props) {
        super(props)

        this.views = { MainView, GroupView, ClusterView, Loading }
        this.state = {
            on: 'MainView',
            mid: props.match.params.id,
            setCtx: this.setState.bind(this),
            getClusterData: this.getClusterData.bind(this)
        }
        $.post(host + '/result/getEvoFile', {
            model_id: this.state.mid
        }, res => {
            if (res.resultDesc === 'Success') {
                fetch(host + res.data.split('Web_NEview')[1]).then(r => r.json()).then(res => {
                    viewData.MainView = res
                    this.state.on === 'Loading' && this.setState({ on: 'MainView' })
                })
            }
        })
        $.post(host + '/result/getZpFile', {
            model_id: this.state.mid
        }, res => {
            if (res.resultDesc === 'Success') {
                fetch(host + res.data.split('Web_NEview')[1]).then(r => r.json()).catch(console.log).then(res => {
                    viewData.GroupView = res
                    // this.state.on === 'Loading' && this.setState({ on: 'GroupView' })
                })
            }
        })
    }
    componentDidMount() {
        // todo
    }
    static getDerivedStateFromProps(props, state) {
        viewData[state.on] || (state.on = 'Loading')
        return state
    }

    getClusterData(cid) {
        this.setState({ on: 'Loading' })
        $.post(host + '/result/getPickedClusterInfo', {
            model_id: this.state.mid,
            cluster_id: cid,
            label: this.state.group
        }, res => {
            if (res.resultDesc === 'Success') {
                viewData.ClusterView = JSON.parse(res.data).cluster_nodes
                this.setState({ on: 'ClusterView' })
            }
        })
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
                {this.views[this.state.on](this.state)}
            </div >
        )
    }
}
