import React, { Component, PureComponent, useState } from 'react'
import echarts from 'echarts'
import style from './charts.css'
import { isNumber } from 'util'
import { _ } from '../../util'

export default class Charts extends PureComponent {
    state = {}
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

    setSankey = ({
        group, evoFile,
        getGroupData, getClusterData,
        setState, clusters, groups, links
    }) => {
        if (!clusters || !groups || !links) {
            clusters = []
            groups = []
            links = []
            groups.size = 0
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
                    groups.size++
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
                            target: groups[i].collector.id,
                            lineStyle: {
                                opacity: 0
                            }
                        }))
                }
            })
            setState({ clusters, groups, links })
            return
        }
        const option = {
            tooltip: {},
            backgroundColor: 'white',
            series: [{
                type: 'sankey',
                top: '7%',
                data: clusters.concat(groups.map(g => g.collector).flat()),
                links: links,
                draggable: true,
                layoutIterations: 64,
                focusNodeAdjacency: 'allEdges',
                label: {
                    formatter: '{b}'
                },
                tooltip: {
                    formatter: '{b} {c}'
                },
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#aaa'
                },
                lineStyle: {
                    color: 'source',
                    opacity: 0.4,
                    curveness: 0.5
                }
            }]
        }
        this.chart.on('click', ({ seriesIndex, dataType, data }) => {
            if (dataType === 'node') {
                setState({
                    on: 'cluster'
                })
                getClusterData({
                    cid: data._origin_.ID,
                    group: data._origin_.group
                })
            }
        })
        this.chart.on('mouseover', ({ seriesIndex, dataType, data }) => {
            if (dataType === 'node') {
                if (group !== data._origin_.group)
                    this.setState({
                        group: data._origin_.group
                    })
            }
        })
        this.chart.setOption(option, true)
    }
    setGroup = ({
        group, graphInfo, getClusterData, setState, groups
    }) => {
        const clusters = groups[group]
        clusters.forEach((clst, i) => (clst.category = i))
        if (false) {
            graphInfo.forEach(v => {
            })
        }
        const categories = clusters.map(v => ({ name: v.name }))
        const option = {
            legend: [{
                type: 'scroll',
                left: 'left',
                orient: 'vertical',
                data: categories.map(ctgr => ctgr.name),
            }],
            backgroundColor: 'white',
            series: [{
                name: "group map",
                type: 'graph',
                layout: 'force',
                force: {
                    repulsion: 100
                },
                zlevel: 0,
                data: clusters,
                // links: [],
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
        this.chart.on('click', ({ seriesName, dataType, data }) => {
            if (seriesName === 'group map' &&
                dataType === 'node') {
                setState({ on: 'cluster' })
                getClusterData(data)
            }
        })
        this.chart.setOption(option, true)
    }
    setCluster = ({
        group, clusterInfo, setState, clusters, groups
    }) => {
        const clst = groups[group].infos.find(v => v.name === clusterInfo.cluster_name)
        const froms = [[], []], tos = [[], []]
        clusterInfo.cluster_nodes.forEach(v => {
            if (v.origin !== 'null') {
                v.itemStyle = {
                    color: '#60ACFC'
                }
                froms[0].push({
                    name: v.key,
                    id: v.id,
                    info: v
                })
                if (!froms[v.origin]) {
                    const c = clusters.find(c => c._origin_.ID === v.origin)
                    froms[0].push({
                        name: c.name,
                        id: c._origin_.ID,
                        info: c
                    })
                    froms[1].push({
                        source: '' + c._origin_.ID,
                        target: '' + v.id
                    })
                    froms[v.origin] = c
                } else {
                    const c = froms[v.origin]
                    froms[1].push({
                        source: '' + c._origin_.ID,
                        target: '' + v.id
                    })
                }
            }
            if (v.aim !== 'null') {
                v.itemStyle = {
                    color: '#5BC49F'
                }
                tos[0].push({
                    name: v.key,
                    id: v.id,
                    info: v
                })
                if (!tos[v.aim]) {
                    const c = clusters.find(c => c._origin_.ID === v.aim)
                    tos[0].push({
                        name: c.name,
                        id: c._origin_.ID,
                        info: c
                    })
                    tos[1].push({
                        source: '' + v.id,
                        target: '' + c._origin_.ID
                    })
                    tos[v.aim] = c
                } else {
                    const c = tos[v.aim]
                    tos[1].push({
                        source: '' + v.id,
                        target: '' + c._origin_.ID,
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
            backgroundColor: 'white',
            series: [{
                name: '全部',
                type: 'graph',
                layout: 'force',
                force: {
                    repulsion: [1, 100],
                    edgeLength: [10, 500],
                    // layoutAnimation: false
                },
                data: clst.nodes,
                links: clst.links,
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
            backgroundColor: 'white',
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

    SankeyGroups = () => {
        const groups = this.props.groups || []
        const ptr = $('#skg-' + this.state.group)[0]
        return (
            <div
                className={style.skg}
                style={{
                    width: `${90 - 90 / groups.size + 2.5}%`
                }}
            >
                <div
                    className={style['skg-block']}
                    onClick={e => {
                        const { setState, getGroupData } = this.props
                        const group = e.target.textContent
                        setState({
                            on: 'group',
                            group
                        })
                        getGroupData(group)
                    }}
                >
                    {groups.map((v, i) => (
                        <div
                            id={'skg-' + i}
                            key={i}
                            onMouseEnter={e => this.setState({ group: i })}
                        >
                            {i}
                        </div>
                    ))}
                </div>
                <div
                    className={style['skg-ptr']}
                    style={{
                        transform: `translateX(${ptr ? ptr.offsetLeft : 0}px)`
                    }}
                />
            </div>
        )
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
                {this.props.type === 'main' && <this.SankeyGroups />}
            </div>
        )
    }
}
