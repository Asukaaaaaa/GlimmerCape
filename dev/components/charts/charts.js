import React, { Component, PureComponent } from 'react'
import echarts from 'echarts'
import style from './charts.css'
import { isNumber } from 'util'
import { _ } from '../../util'

export default class Charts extends PureComponent {
    constructor(props) {
        super(props)
        this.chartRef = React.createRef()
        this.maps = {
            'main': this.setSankey,
            'group': this.setGroup,
            'cluster': this.setCluster,
            'radar': this.setRadar
        }
    }

    setSankey = ({ evoFile, getGroupData, setState }) => {
        const clusters = [], groups = [], links = []
        evoFile.nodes.forEach(n => {
            const cl = {
                name: n.name,
                id: n.name + n.group,
                _origin_: n
            }
            clusters.push(cl)
            if (groups[n.group])
                groups[n.group].push(cl)
            else {
                groups[n.group] = []
                groups[n.group].collector = {
                    name: n.group,
                    id: n.group,
                    itemStyle: {
                        opacity: 0
                    }
                }
            }
        })
        evoFile.links.forEach(l => {
            links.push({
                source: l.source + l.sourcegroup,
                target: l.target + l.targetgroup,
                value: l.value,
                _origin_: l
            })
        })
        groups.forEach((g, i) => {
            if (++i !== groups.length) {
                links.push({
                    source: g.collector.id,
                    target: groups[i].collector.id
                })
                g.forEach(c => links.push(
                    {
                        source: c.id,
                        target: groups[i].collector.id
                    }))
            }
        })
        const option = {
            tooltip: {},
            series: [{
                type: 'sankey',
                data: clusters.concat(groups.map(g => g.collector).flat()),
                links: links,
                focusNodeAdjacency: 'allEdges',
                label: {
                    formatter: '{b}'
                },
                tooltip: {
                    formatter: '{b} {c}'
                },
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    }
                },
                lineStyle: {
                    normal: {
                        color: 'source',
                        curveness: 0.5
                    }
                }
            }]
        }
        this.chart.on('click', ({ seriesIndex, dataType, data }) => {
            if (dataType === 'node') {
                setState({ on: 'group' })
                getGroupData(data._origin_.group)
            }
        })
        this.chart.setOption(option, true)
        Object.assign(this, {
            clusters, groups
        })
    }
    setCluster = (data) => {
        this.clst = this.clusters.find(v => v.name === data.cluster_name)
        const froms = [[], []], tos = [[], []]
        data.cluster_nodes.forEach(v => {
            if (v.origin !== 'null') {
                froms[0].push({
                    name: v.key,
                    id: v.id,
                    info: v
                })
                if (!froms[v.origin]) {
                    const c = this.props.clusters.find(c => c.ID === v.origin)
                    froms[0].push({
                        name: c.name,
                        id: c.ID,
                        info: c
                    })
                    froms[1].push({
                        source: '' + c.ID,
                        target: '' + v.id
                    })
                    froms[v.origin] = c
                } else {
                    const c = froms[v.origin]
                    froms[1].push({
                        source: '' + c.ID,
                        target: '' + v.id
                    })
                }
            }
            if (v.aim !== 'null') {
                tos[0].push({
                    name: v.key,
                    id: v.id,
                    info: v
                })
                if (!tos[v.aim]) {
                    const c = this.props.clusters.find(c => c.ID === v.aim)
                    tos[0].push({
                        name: c.name,
                        id: c.ID,
                        info: c
                    })
                    tos[1].push({
                        source: '' + v.id,
                        target: '' + c.ID
                    })
                    tos[v.aim] = c
                } else {
                    const c = tos[v.aim]
                    tos[1].push({
                        source: '' + v.id,
                        target: '' + c.ID,
                    })
                }
            }
        })
        const option = {
            /* title: {
                text: name,
                top: 'top',
                left: 'center',
            },*/
            legend: [{
                left: 'left',
                orient: 'vertical',
                selected: {
                    '全部': true
                },
                selectedMode: 'single',
                data: ['全部', '前驱', '后继']
            }],
            series: [{
                name: '全部',
                type: 'graph',
                layout: 'force',
                force: {
                    repulsion: [1, 100],
                    edgeLength: [10, 500],
                    // layoutAnimation: false
                },
                data: this.clst.nodes,
                links: this.clst.links,
                roam: true,
                focusNodeAdjacency: true,
                label: {
                    show: true
                },
                itemStyle: {
                    color: '#333333',
                    borderColor: '#fff',
                    borderWidth: 1,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                },
                lineStyle: {
                    color: 'gray',
                    // curveness: 0.3
                },
                emphasis: {
                    lineStyle: {
                        width: 10
                    }
                }
            }, {
                name: '前驱',
                type: 'graph',
                layout: 'force',
                force: {
                    repulsion: 100,
                    edgeLength: 100,
                    // layoutAnimation: false
                },
                data: froms[0],
                links: froms[1],
                edgeSymbol: ['none', 'arrow'],
                roam: true,
                focusNodeAdjacency: true,
                label: {
                    show: true
                },
            }, {
                name: '后继',
                type: 'graph',
                layout: 'force',
                force: {
                    repulsion: 100,
                    edgeLength: 100,
                    // layoutAnimation: false
                },
                data: tos[0],
                links: tos[1],
                edgeSymbol: ['none', 'arrow'],
                roam: true,
                focusNodeAdjacency: true,
                label: {
                    show: true
                },
            }]
        }
        this.chart.setOption(option, true)
        this.chart.on('click', param => {
            // todo
        })
    }
    setGroup = ({ graphInfo }) => {
        const { clusters } = this
        graphInfo.forEach(v => {
            let pclst = clusters.findIndex(clst => clst.name === v.clusterName)
            pclst === -1 &&
                (pclst = clusters.push({
                    name: v.clusterName,
                    cid: v.clusterId,
                    nodes: [],
                    links: []
                }) - 1)
            const clst = clusters[pclst]
            if (!isNumber(clst.nodes['n' + v.source_nodeName])) {
                clst.nodes['n' + v.source_nodeName] = clst.nodes.length
                clst.nodes.push({
                    catagory: pclst,
                    name: v.source_nodeName,
                    id: v.source_nodeID,
                    symbolSize: 6,
                })
            }
            v.target.forEach(t => {
                if (!isNumber(clst.nodes['n' + t.target_nodeName])) {
                    clst.nodes['n' + t.target_nodeName] = clst.nodes.length
                    clst.nodes.push({
                        catagory: pclst,
                        name: t.target_nodeName,
                        id: t.target_nodeID,
                        symbolSize: 6,
                    })
                }
                if (!(clst.links[`${'n' + v.source_nodeName}_${'n' + t.target_nodeName}`] &&
                    clst.links[`${'n' + v.target_nodeName}_${'n' + t.source_nodeName}`])) {
                    clst.links[`${'n' + v.source_nodeName}_${'n' + t.target_nodeName}`] = true
                    const ps = clst.nodes['n' + v.source_nodeName], pt = clst.nodes['n' + t.target_nodeName]
                    clst.links.push({
                        source: '' + clst.nodes[ps].id,
                        target: '' + clst.nodes[pt].id
                    })
                    if (clst.nodes[ps].symbolSize < 30)
                        clst.nodes[ps].symbolSize += 3
                    else
                        clst.nodes[ps].symbolSize += 1
                }
            })
            clst.category = pclst
            clst.symbolSize = clst.nodes.length + 15
        })
        this.clusters = clusters
        const categories = clusters.map(v => ({ name: v.name }))
        const option = {
            legend: [{
                type: 'scroll',
                left: 'left',
                orient: 'vertical',
                data: categories.map(ctgr => ctgr.name),
            }],
            series: [{
                name: "group map",
                type: 'graph',
                layout: 'force',
                force: {
                    // 使用默认值
                    repulsion: 100
                },
                zlevel: 0,
                data: clusters,
                links: [],
                categories,
                roam: true,
                focusNodeAdjacency: true,
                label: {
                    show: true
                },
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 1,
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    }
                },
            }]
        }
        this.chart.setOption(option, true)
        this.chart.on('click', params => {
            if (params.seriesName === 'group map') {
                this.props.setSelect({
                    id: params.data.cid,
                    name: params.data.name
                }).then(res => {
                    this.setCluster(res)
                    this.chart.hideLoading()
                })
                this.chart.showLoading()
            }
        })
    }
    setRadar = () => {
        this.chart.setOption({
            tooltip: {
            },
            legend: {
                data: this.props.data.map(v => v.label),
                left: 'left',
                orient: 'vertical'
            },
            radar: {
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: [
                    { name: '边数', max: this.props.data.reduce((acc, v) => acc > v.edge_num ? acc : v.edge_num, 0) },
                    { name: '最大度', max: this.props.data.reduce((acc, v) => acc > v.max_degree ? acc : v.max_degree, 0) },
                    { name: '密度', max: this.props.data.reduce((acc, v) => acc > v.density ? acc : v.density, 0) },
                    { name: '社区数', max: this.props.data.reduce((acc, v) => acc > v.coummunity_num ? acc : v.coummunity_num, 0) },
                    { name: '节点数', max: this.props.data.reduce((acc, v) => acc > v.node_num ? acc : v.node_num, 0) },
                    { name: '平均度', max: this.props.data.reduce((acc, v) => acc > v.average_degree ? acc : v.average_degree, 0) }
                ]
            },
            series: [{
                type: 'radar',
                data: this.props.data.map(v => ({
                    value: [v.edge_num, v.max_degree, v.density, v.coummunity_num, v.node_num, v.average_degree],
                    name: v.label
                }))
            }]
        }, true)
    }

    init(props = this.props) {
        this.chart.showLoading()
        this.maps[props.type](props)
        this.chart.hideLoading()
    }
    componentDidMount() {
        this.chart = echarts.init(this.chartRef.current)
        this.init()
    }
    componentWillReceiveProps(props) {
        this.init(props)
    }

    render() {
        return (
            <div className={style.main}>
                <div
                    ref={this.chartRef}
                    style={{
                        width: this.props.width,
                        height: this.props.height
                    }}
                >
                </div>
            </div>
        )
    }
}
