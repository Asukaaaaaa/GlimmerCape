import React, { Component, useState, useEffect } from 'react'

import { Tabs, Icon, Button, Steps, Spin } from 'antd'
const { TabPane } = Tabs, { Step } = Steps

import Table, { Column } from '../table/table'
import Charts from '../charts/charts'
import SvgGraph from '../Svg-graph/graph'

import { _, host } from '../../util'
import style from './model-detail.css'
import ClusterData from '../../../static/cluster.json'


const MainSider = ({ mid, radarInfo, coword }) => {
    const names = Object.keys(coword[0])
    names.splice(names.findIndex(v => v === 'words'), 1)
    return (
        <React.Fragment>
            <div style={{
                height: '300px'
            }}>
                <Charts
                    type='radar'
                    data={radarInfo}
                    mid={mid}
                />
            </div>
            <div style={{ height: 'calc(100% - 300px)' }}>
                <Table
                    name='词列表'
                    data={coword}
                    export={() => {
                        fetch(host + '/result/ExportCoword?model_id=' + mid)
                            .then(res => res.json())
                            .then(res => {
                                res = res.data.split('Web_NEview')[1]
                                _.download(host + res, '词列表.xls')
                            })
                    }}
                >
                    <Column width='30%' title="词汇" dataIndex="word" key="-1" />
                    {names.map((v, i) => (
                        <Column title={v} dataIndex={v} key={i}
                            sorter={(a, b) => b[v] - a[v]} />
                    ))}
                </Table>
            </div>
        </React.Fragment>
    )
}
const GroupSider = ({ group, zpFile }) => {
    return (
        <SvgGraph graph='scatter' data={[zpFile.find(v => v.label === group)]} />
    )
}
const ClusterSider = ({ mid, group, clusterInfo }) => {
    return (
        <React.Fragment>
            <div
                className={style.cinfo}
                title=''
            >
                <div>
                    <Icon type='bar-chart' />
                    <span>社区信息</span>
                </div>
                <div className={style.ctitle2}>
                    <span>{clusterInfo.cluster_name}</span>
                    <span>{clusterInfo.label}</span>
                </div>
                <div className={style.c2}>
                    <div>节点数<span>{clusterInfo.cluster_nodesnum}</span></div>
                    <div>边数<span>{clusterInfo.cluster_edgesnum}</span></div>
                </div>
                <div className={style.c2}>
                    <div>平均度<span>{clusterInfo.cluster_avdegree}</span></div>
                    <div>最大度<span>{clusterInfo.cluster_maxdegree}</span></div>
                </div>
                <div className={style.c2}>
                    <div>密度<span>{clusterInfo.cluster_density}</span></div>
                </div>
            </div>
            <div
                style={{ minHeight: 'calc(100% - 300px)' }}
                title='社区词列表'
            >
                <Table
                    name='社区词列表'
                    data={clusterInfo.cluster_nodes}
                    export={() => {
                        fetch(host + '/result/ExportClusterInfo' +
                            '?model_id=' + mid +
                            '&label=' + group +
                            '&cluster_id=' + clusterInfo.cluster_ID)
                            .then(res => res.json())
                            .then(res => {
                                res = res.data.split('Web_NEview')[1]
                                _.download(host + res, '社区数据.xls')
                            })
                    }}>
                    <Column width='30%' title="词汇" dataIndex="key" key="key" />
                    <Column title="Z-value" dataIndex="z_value" key="z_value"
                        sorter={(a, b) => b.z_value - a.z_value} />
                    <Column title="P-value" dataIndex="p_value" key="p_value"
                        sorter={(a, b) => b.p_value - a.p_value} />
                    <Column title="词频" dataIndex="weight" key="weight"
                        sorter={(a, b) => b.weight - a.weight} />
                </Table>
            </div>
        </React.Fragment>
    )
}


export default class ModelDetail extends Component {
    state = {

    }
    constructor(props) {
        super(props)
        this.state = {
            mid: props.match.params.id,
            // main
            evoFile: null,
            radarInfo: null,
            coword: null,
            // group
            graphInfo: null,
            zpFile: null,
            // cluster
            clusterInfo: null,

            // getter
            getMainData: _.debounce(this.getMainData),
            getGroupData: _.debounce(this.getGroupData),
            getClusterData: _.debounce(this.getClusterData),
            // setter
            setState: _.debounce(this.setState.bind(this))
        }
    }
    getMainData = () => {
        $.post(host + '/result/getEvoFile', {
            model_id: this.state.mid
        }, res => {
            if (res.resultDesc === 'Success')
                fetch(host + res.data.split('Web_NEview')[1])
                    .then(r => r.json())
                    .then(res => this.setState({ evoFile: res }))
        })
        $.post(host + '/result/getZpFile', {
            model_id: this.state.mid
        }, res => {
            if (res.resultDesc === 'Success')
                fetch(host + res.data.split('Web_NEview')[1])
                    .then(r => r.json())
                    .catch(console.log)
                    .then(res => this.setState({ zpFile: res }))
        })
        $.post(host + '/result/getRadarPath', {
            model_id: this.state.mid
        }, res => {
            if (res.resultDesc === 'Success')
                fetch(host + res.data.split('Web_NEview')[1])
                    .then(r => r.json())
                    .then(res => this.setState({ radarInfo: res }))
        })
        $.post(host + '/result/getCoword', {
            model_id: this.state.mid
        }, res => {
            if (res.resultDesc === 'Success')
                fetch(host + res.data.split('Web_NEview')[1])
                    .then(r => r.json())
                    .then(res => this.setState({ coword: res }))
        })
    }
    getGroupData = (group) => {
        $.post(host + '/result/getGraphInfo', {
            model_id: this.state.mid,
            label: group
        }, res => {
            if (res.resultDesc === 'Success')
                fetch(host + res.data.split('Web_NEview')[1])
                    .then(r => r.json())
                    .catch(console.log)
                    .then(res => this.setState({ graphInfo: res }))
        })
    }
    getClusterData = ({ cid, group }) => {
        $.post(host + '/result/getPickedClusterInfo', {
            model_id: this.state.mid,
            cluster_id: cid,
            label: group || this.state.group
        }, res => {
            if (res.resultDesc === 'Success')
                this.setState({ clusterInfo: JSON.parse(res.data) })
        })
    }

    componentDidMount() {
        this.setState({ on: 'main' })
        this.getMainData()
    }

    getChart = () => {
        const chartData = {
            main: 'evoFile',
            group: 'graphInfo',
            cluster: 'clusterInfo'
        }[this.state.on]
        const loading = (chartData && this.state[chartData]) ? false : true
        const ctTitles = {
            main: '桑基图：显示周期中社区具体的演化情况。可按照中心度、社区节点数量、密度这三个指标对社区进行排序。矩形颜色块表示社区，两个时间段的矩形之间的曲线形色块表示演化的过程，颜色块的高度表示社区的节点规模。演化曲线的值表示该父社区对子社区的影响程度。',
            group: '社区图：指定周期中社区具体情况，大小代表社区节点规模。',
            cluster: '社区词关联：表示该社区内部词与词之间的关系网络。'
        }
        return (
            <div className={style.graph}>
                {loading && <Spin className={style.loading} indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} />}
                {loading || <Charts {...this.state} type={this.state.on} title={ctTitles[this.state.on]} />}
            </div>
        )
    }
    getSider = () => {
        if (this.state.on === 'main') {
            if (this.state.radarInfo &&
                this.state.coword)
                return <MainSider {...this.state} />
        } else if (this.state.on === 'group') {
            if (this.state.zpFile)
                return <GroupSider {...this.state} />
        } else if (this.state.on === 'cluster') {
            if (this.state.clusterInfo)
                return <ClusterSider {...this.state} />
        }
        return null
    }
    render() {
        return (
            <div className={style.main} >
                <this.getChart />
                <div className={style.right}>
                    <this.getSider />
                </div>
            </div >
        )
    }
}
