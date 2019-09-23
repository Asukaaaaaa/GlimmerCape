import React, { Component } from 'react'

import { Tabs, Table, Icon, Button } from 'antd'
const { TabPane } = Tabs, { Column } = Table

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
                <SvgGraph graph='sankey' mid={mid} setCtx={setCtx} />
                {/*handleSelectNode={info => {
                    this.setState({ node: info })
                    $.post(host + '/result/getPickedClusterInfo', {
                        model_id: this.props.match.params.id,
                        cluster_id: info.id,
                        label: info.year
                    }, res => res.resultDesc === 'Success' && this.setState({ clusterData: JSON.parse(res.data).cluster_nodes }))
                }}*/}
            </div>
            <div className={style.right}>
                <Charts type='radar' width='400' height='300' data={radarData} />
            </div>
        </div>
    )
}
const GroupView = () => {
    return (
        <div className={style.container}>
            <div className={style.graph}>
                <Charts type='force' width='1000' height='600' data={forceData} />
            </div>
            <div className={style.right}>
                <SvgGraph graph='scatter' />
            </div>
        </div>
    )
}
const ClusterView = () => {
    return (
        <div className={style.container}>
            <div className={style.graph}>
                <SvgGraph graph='circular' />
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

export default class ModelDetail extends Component {
    constructor(props) {
        super(props)

        this.views = { MainView, GroupView, ClusterView, Loading }
        this.state = {
            on: 'MainView',
            mid: props.match.params.id,
            setCtx: this.setState.bind(this)
        }
    }

    render() {
        return (
            <div className={style.main}>
                {this.views[this.state.on](this.state)}
            </div>
        )
    }
}
