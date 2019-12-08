import React, { Component, useState, useEffect } from 'react'

import { Tabs, Icon, Button, Steps, Spin } from 'antd'
const { TabPane } = Tabs, { Step } = Steps

import Table, { Column } from '../table/table'
import Charts from '../charts/charts'
import Skeleton from '../skeleton/skeleton'

import { _, host } from '../../utils'
import style from './model-detail.css'


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
const GroupSider = ({ group, zps }) => {
    return (
        <Charts type='scatter' data={zps[group]} />
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
            radarInfo: null,
            coword: null,
            zpFile: null,

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
                    .then(res => {
                        const groups = [], links = []
                        groups.size = 0
                        res.nodes.forEach(n => {
                            const cl = {
                                name: n.name,
                                id: n.name + n.group,
                                _origin_: n
                            }
                            if (groups[n.group])
                                groups[n.group].push(cl)
                            else {
                                groups.size++
                                groups[n.group] = [cl]
                                groups[n.group].collector = {
                                    name: n.group,
                                    id: n.group,
                                    itemStyle: {
                                        opacity: 0
                                    }
                                }
                            }
                        })
                        res.links.forEach(l => {
                            links.push({
                                source: l.source + l.sourcegroup,
                                target: l.target + l.targetgroup,
                                value: l.value,
                                _origin_: l
                            })
                        })
                        groups.nodesMap = new Map()
                        groups.forEach((g, i) => {
                            if (++i !== groups.length) {
                                links.push({
                                    source: g.collector.id,
                                    target: groups[i].collector.id
                                })
                                g.forEach(c => {
                                    links.push({
                                        source: c.id,
                                        target: groups[i].collector.id,
                                        lineStyle: {
                                            opacity: 0
                                        }
                                    })
                                    groups.nodesMap.set(c.id, c)
                                })
                            }
                        })
                        groups.forEach((g, i) => this.getGroupData(i))
                        this.setState({ groups, links })
                    })
        })
        $.post(host + '/result/getZpFile', {
            model_id: this.state.mid
        }, res => {
            if (res.resultDesc === 'Success')
                fetch(host + res.data.split('Web_NEview')[1])
                    .then(r => r.json())
                    .then(res => {
                        const zps = res.reduce((acc, { zp, label }) => {
                            acc[label] = {
                                black: [],
                                greeen: [],
                                red: [],
                                blue: []
                            }
                            zp.forEach(v => {
                                acc[label][v.gender].push([v.weight, v.height])
                            })
                            return acc
                        }, {})
                        this.setState({ zps })
                    })
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
                    .then(res => {
                        const { groups } = this.state
                        const clusters = groups[group]
                        const clstMap = new Map()
                        clusters.forEach(cluster => {
                            cluster._origin_.nodes = new Map()
                            cluster._origin_.links = []
                            clstMap.set(cluster.name, cluster)
                        })
                        res.forEach(v => {
                            const cl = clstMap.get(v.clusterName)
                            cl._origin_.nodes.has(v.source_nodeName) ||
                                cl._origin_.nodes.set(v.source_nodeName, {
                                    name: v.source_nodeName,
                                    id: '' + v.source_nodeID
                                })
                            v.target.forEach(t => {
                                cl._origin_.nodes.has(t.target_nodeName) ||
                                    cl._origin_.nodes.set(t.target_nodeName, {
                                        name: t.target_nodeName,
                                        id: '' + t.target_nodeID
                                    })
                                cl._origin_.links.push({
                                    source: '' + v.source_nodeID,
                                    target: '' + t.target_nodeID
                                })
                            })
                        })
                        clusters.forEach((cluster, i) => {
                            cluster.category = i
                            cluster._origin_.nodes = Array.from(cluster._origin_.nodes).map(arr => arr[1])
                            cluster.symbolSize = 15 + cluster._origin_.nodes.length
                        })
                        clusters.info = true
                        this.setState({ groups })
                    })
        })
    }
    getClusterData = ({ ID, group }) => {
        $.post(host + '/result/getPickedClusterInfo', {
            model_id: this.state.mid,
            cluster_id: ID,
            label: group
        }, res => {
            if (res.resultDesc === 'Success') {
                res = JSON.parse(res.data)
                const { cluster, group, groups } = this.state
                const nodesMap = new Map()
                cluster.nodes.forEach(n => nodesMap.set(n.name, n))
                res.cluster_nodes.forEach(v => {
                    const n = nodesMap.get(v.key)
                    try {
                        if (v.origin !== 'null') {
                            n.itemStyle = {
                                color: '#60ACFC'
                            }
                        }
                        if (v.aim !== 'null') {
                            n.itemStyle = {
                                color: '#FF7C7C'
                            }
                        }
                    } catch (e) {
                        console.warn(e)
                    }
                })
                cluster.info = true
                this.setState({
                    groups,
                    clusterInfo: res
                })
            }
        })
    }

    componentDidMount() {
        this.setState({ on: 'main' })
        this.getMainData()
    }

    getChart = () => {
        const { on, cluster, group, groups } = this.state
        const [loading, setLoading] = useState(true)
        useEffect(() => {
            this.titles = {
                main: '桑基图：显示周期中社区具体的演化情况。可按照中心度、社区节点数量、密度这三个指标对社区进行排序。矩形颜色块表示社区，两个时间段的矩形之间的曲线形色块表示演化的过程，颜色块的高度表示社区的节点规模。演化曲线的值表示该父社区对子社区的影响程度。',
                group: '社区图：指定周期中社区具体情况，大小代表社区节点规模。',
                cluster: '社区词关联：表示该社区内部词与词之间的关系网络。'
            }
        }, [])
        useEffect(() => {
            switch (on) {
                case 'main':
                    if (groups) {
                        setLoading(false)
                    }
                    break
                case 'group':
                    if (groups &&
                        groups[group] &&
                        groups[group].info) {
                        setLoading(false)
                    }
                    break
                case 'cluster':
                    if (group &&
                        groups &&
                        groups[group].info &&
                        cluster &&
                        cluster.info) {
                        setLoading(false)
                    }
                    break
            }
        })
        return (
            <div className={style.graph}>
                {loading &&
                    <Spin className={style.loading} indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} /> ||
                    <Charts
                        {...this.state}
                        type={on}
                        title={this.titles[on]}
                    />}
            </div>
        )
    }
    getSider = () => {
        const { on, radarInfo, coword, zps, clusterInfo } = this.state
        switch (on) {
            case 'main':
                if (radarInfo &&
                    coword)
                    return <MainSider {...this.state} />
                break
            case 'group':
                if (zps)
                    return <GroupSider {...this.state} />
                break

            case 'cluster':
                if (clusterInfo)
                    return <ClusterSider {...this.state} />
                break
        }
        return <Skeleton />
    }
    render() {
        return (
            <div className={style.main} >
                <Steps
                    className={style.steps}
                    current={
                        this.state.on == 'main' ? 0 :
                            this.state.on == 'group' ? 1 :
                                this.state.on == 'cluster' ? 2 : -1
                    }
                >
                    <Step
                        onClick={e => this.setState({ on: 'main' })}
                    />
                    <Step
                        onClick={e => this.state.group && this.setState({ on: 'group' })}
                    />
                    <Step
                        onClick={e => this.state.cluster && this.setState({ on: 'cluster' })}
                    />
                </Steps>
                <this.getChart />
                <div className={style.right}>
                    <this.getSider />
                </div>
            </div >
        )
    }
}
