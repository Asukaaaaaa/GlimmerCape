import React, { Component, useState, useEffect } from 'react'

import { Tabs, Icon, Button, Steps, Spin } from 'antd'
const { TabPane } = Tabs, { Step } = Steps

import Table, { Column } from '../table/table'
import Charts from '../charts/charts'
import SvgGraph from '../Svg-graph/graph'

import { _, host } from '../../util'
import style from './model-detail.css'
import ClusterData from '../../../static/cluster.json'

const MainView = ({ mid, setCtx, group }) => {
    const names = Object.keys(viewData.main[2][0])
    names.splice(names.findIndex(v => v === 'words'), 1)
    return (
        <div className={style.container}>
            <div className={style.graph}>
                {/* <SvgGraph graph='sankey' data={viewData.main[1]} setCtx={setCtx} /> */}
                <Charts type='sankey' width='1000px' height='600px' data={viewData.main[1]} />
            </div>
            <div className={style.right}>
                <Charts type='radar' width='400px' height='300px' data={viewData.main[0]} />
                <div style={{ height: 'calc(100% - 300px)' }}>
                    <Table data={viewData.main[2]}
                        export={() => {
                            fetch(host + '/result/ExportCoword?model_id=' + mid)
                                .then(res => res.json())
                                .then(res => {
                                    res = res.data.split('Web_NEview')[1]
                                    _.download(host + res, '词列表.xls')
                                })
                        }}>
                        <Column width='30%' title="词汇" dataIndex="word" key="-1" />
                        {names.map((v, i) => (
                            <Column title={v} dataIndex={v} key={i}
                                sorter={(a, b) => b[v] - a[v]} />
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    )
}
const ClusterSider = ({ data, mid, group }) => {
    return (
        <div style={{ display: 'contents' }}>
            <div className={style.cinfo}>
                <div>
                    <Icon type='bar-chart' />
                    <span>社区信息</span>
                </div>
                <div className={style.ctitle2}>
                    <span>{data.cluster_name}</span>
                    <span>{data.label}</span>
                </div>
                <div className={style.c2}>
                    <div>节点数<span>{data.cluster_nodesnum}</span></div>
                    <div>边数<span>{data.cluster_edgesnum}</span></div>
                </div>
                <div className={style.c2}>
                    <div>平均度<span>{data.cluster_avdegree}</span></div>
                    <div>最大度<span>{data.cluster_maxdegree}</span></div>
                </div>
                <div className={style.c2}>
                    <div>密度<span>{data.cluster_density}</span></div>
                </div>
            </div>
            <div style={{ minHeight: 'calc(100% - 300px)' }}>
                <Table data={data.cluster_nodes}
                    export={() => {
                        fetch(host + '/result/ExportClusterInfo' +
                            '?model_id=' + mid +
                            '&label=' + group +
                            '&cluster_id=' + data.cluster_ID)
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
        </div>
    )
}
const GroupView = ({ mid, group, cinfo, setCtx }) => {
    const [sider, setSider] = useState('scatter')
    const [select, setSelect] = useState()
    const [data, setData] = useState()
    const setSelect_ = (obj) => {
        setSelect(obj)
        setCtx({ cinfo: obj }, 'common')
        if (obj.id) {
            setSider('loading')
            return setCtx(obj, 'GetCluster').then(res => {
                setData(res)
                setSider('cluster')
                return res
            })
        }
    }
    useEffect(() => {
        cinfo && setSelect_(cinfo)
    }, [])
    useEffect(() => {
        if (!cinfo) {
            setSider('scatter')
            setData()
        }
    })
    return (
        <div className={style.container}>
            <div className={style.graph}>
                <Charts type='group' width='1000px' height='600px' data={viewData.group[0]} setSelect={setSelect_} clusters={viewData.main[1].nodes} cdata={data} />
            </div>
            <div className={style.right}>
                {{
                    loading: <Spin className={style.loading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />,
                    scatter: <SvgGraph graph='scatter' data={[viewData.group[1].find(v => v.label == group)]} />,
                    cluster: <ClusterSider data={data} mid={mid} group={group} />
                }[sider]}
            </div>
        </div>
    )
}
const ClusterView = ({ }) => {

}
const Loading = () => (
    <Spin className={style.loading} indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} />
)

const viewData = {}

export default class ModelDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            on: 'main',
            cinfo: null,
            mid: props.match.params.id,
            setCtx: ((obj, mode) => {
                if (mode === 'SetGroup') {
                    this.setState({
                        on: 'loading',
                        group: obj.group || obj.year
                    })
                    return Promise.all([
                        new Promise((resolve, reject) => {
                            $.post(host + '/result/getGraphInfo', {
                                model_id: this.state.mid,
                                label: obj.group || obj.year
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
                            viewData.group = val
                            this.setState({ on: 'group' })
                        })
                } else if (mode === 'GetCoword') {
                    // todo
                } else if (mode === 'GetCluster') {
                    return new Promise((resolve, reject) => $.post(host + '/result/getPickedClusterInfo', {
                        model_id: this.state.mid,
                        cluster_id: obj.id,
                        label: obj.year || this.state.group
                    }, res => {
                        if (res.resultDesc === 'Success') {
                            resolve(JSON.parse(res.data))
                        }
                    }))
                } else if (mode === 'common') {
                    this.setState(obj)
                }
            }).bind(this)
        }
    }
    componentDidMount() {
        this.setState({ on: 'loading' })
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
                viewData.main = val
                this.setState({ on: 'main' })
            })
    }
    static getDerivedStateFromProps(props, state) {
        viewData[state.on] || (state.on = 'loading')
        return state
    }
    componentWillUnmount() {
        delete viewData.main
        delete viewData.group
    }

    render() {
        let step
        if (this.state.on === 'main')
            step = 0
        else if (this.state.on === 'group')
            if (this.state.cinfo)
                step = 2
            else
                step = 1
        return (
            <div className={style.main} >
                <Steps className={style.steps}
                    current={step}
                    onChange={s => {
                        s == 0 && this.setState({ on: 'main' })
                        s == 1 && viewData.group && this.setState({ on: 'group', cinfo: null })
                    }}>
                    <Step title="Main" description="" />
                    <Step title="Slice" description="" />
                    <Step title="Cluster" description="" />
                </Steps>
                {{
                    main: <MainView {...this.state} />,
                    group: <GroupView {...this.state} />,
                    loading: <Loading {...this.state} />
                }[this.state.on]}
            </div >
        )
    }
}
