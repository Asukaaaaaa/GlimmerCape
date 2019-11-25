import React, { Component, PureComponent, useState } from 'react'
import echarts from 'echarts'
import style from './charts.css'
import { _, imgs, ClassNames, host } from '../../util'
import { node } from 'prop-types'

export default class Charts extends PureComponent {
    state = {}
    constructor(props) {
        super(props)
        this.chartRef = React.createRef()
        this.modalRef = React.createRef()
        this.maps = {
            'main': this.setSankey,
            'group': this.setGroup,
            'cluster': this.setCluster,
            'radar': this.setRadar
        }
    }

    setSankey = ({
        group,
        getGroupData, getClusterData,
        setState, groups, links
    }) => {
        const categories = groups.map((g, i) => i).flat()
        const sorter = (key) => {
            groups.forEach(g => g.sort((a, b) => (a._origin_[key] - b._origin_[key])))
            this.props.setState(groups)
        }
        const option = {
            tooltip: {},
            toolbox: {
                show: true,
                orient: 'horizontal',
                right: '20px',
                bottom: '15px',
                feature: {
                    mySort0: {
                        show: true,
                        title: '密度排序',
                        icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                        onclick: e => sorter('density')
                    },
                    mySort1: {
                        show: true,
                        title: '中心度排序',
                        icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                        onclick: e => sorter('centrality')
                    },
                    mySort2: {
                        show: true,
                        title: '节点数排序',
                        icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                        onclick: e => sorter('num')
                    },
                }
            },
            backgroundColor: 'white',
            series: [{
                type: 'sankey',
                top: '7%',
                data: groups.map(g => g.concat(g.collector)).flat(),
                links: links,
                draggable: false,
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
                    opacity: 0.7,
                    curveness: 0.5
                }
            }]
        }
        this.chart.on('click', ({ seriesIndex, dataType, data }) => {
            if (dataType === 'node') {
                const _nodes = [], _links = []
                _nodes.push = function (v) {
                    if (!this[v.id]) {
                        this[v.id] = true
                        Array.prototype.push.call(this, v)
                    }
                }
                const nodesMap = groups.nodesMap
                groups.forEach(g => g.forEach(cl => cl.name == data._origin_.name && _nodes.push(cl)))
                links.forEach(l => {
                    if (l.source.includes(data._origin_.name) &&
                        nodesMap.has(l.target)) {
                        _links.push(l)
                        _nodes.push(nodesMap.get(l.target))
                    } else if (
                        l.target.includes(data._origin_.name) &&
                        nodesMap.has(l.source)) {
                        _links.push(l)
                        _nodes.push(nodesMap.get(l.source))
                    }
                })
                this.modal.on('click', ({ seriesIndex, dataType, data }) => {
                    if (dataType === 'node') {
                        setState({
                            on: 'cluster',
                            group: data._origin_.group,
                            cluster: data._origin_
                        })
                        getClusterData(data._origin_)
                    }
                })
                this.setState({
                    modalOn: true
                })
                this.modal.showLoading()
                this.modal.setOption({
                    tooltip: {},
                    backgroundColor: 'white',
                    series: [{
                        type: 'sankey',
                        data: _nodes,
                        links: _links,
                        focusNodeAdjacency: 'allEdges',
                        label: {
                            formatter: '{a}'
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
                            opacity: 0.7,
                            curveness: 0.5
                        }
                    }]
                }, true)
                this.modal.hideLoading()
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
        group, graphInfo, getClusterData,
        setState, groups
    }) => {
        const clusters = groups[group]
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
                setState({
                    on: 'cluster',
                    group: data._origin_.group,
                    cluster: data._origin_
                })
                getClusterData(data._origin_)
            }
        })
        this.chart.setOption(option, true)
    }
    setCluster = ({
        cluster
    }) => {
        const option = {
            color: ['#60ACFC', '#FF7C7C'],
            legend: [{
                left: 'left',
                orient: 'vertical',
                selected: {
                    '全部': true,
                    '前驱': true,
                    '后继': true
                },
                selectedMode: 'multiple',
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
                data: cluster.nodes,
                links: cluster.links,
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
            }, {
                name: '后继',
                type: 'graph',
            }]
        }
        this.chart.setOption(option, true)
        this.chart.on('click', param => {
            // todo
        })
    }
    setRadar = () => {
        const categories = this.props.data.map(v => v.label)
        const limits = [
            this.props.data.reduce((acc, v) => acc > v.edge_num ? acc : v.edge_num, 0),
            this.props.data.reduce((acc, v) => acc > v.max_degree ? acc : v.max_degree, 0),
            this.props.data.reduce((acc, v) => acc > v.density ? acc : v.density, 0),
            this.props.data.reduce((acc, v) => acc > v.coummunity_num ? acc : v.coummunity_num, 0),
            this.props.data.reduce((acc, v) => acc > v.node_num ? acc : v.node_num, 0),
            this.props.data.reduce((acc, v) => acc > v.average_degree ? acc : v.average_degree, 0)
        ]
        const tags = ['边数', '最大度', '密度', '社区数', '节点数', '平均度']
        const toolbox = {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'middle',
            feature: {
                myBar: {
                    show: true,
                    title: '切换视图',
                    icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                    onclick: e => {
                        this.chart.setOption({
                            toolbox,
                            grid: tags.map((t, i) => ({
                                height: 50 / tags.length + '%',
                                x: '15%',
                                y: 10 + i * 84 / tags.length + '%'
                            })),
                            xAxis: tags.map((t, i) => ({
                                gridIndex: i,
                                type: 'value',
                                min: 0,
                                max: limits[i],
                            })),
                            yAxis: tags.map((t, i) => ({
                                gridIndex: i,
                                type: 'category',
                                data: [t]
                            })),
                            legend: {
                                type: 'scroll',
                                left: 'center',
                                selectedMode: 'single',
                                selected: {
                                    [`${categories[0]}`]: true
                                },
                                data: categories
                            },
                            series: this.props.data.map(v => [v.edge_num, v.max_degree, v.density, v.coummunity_num, v.node_num, v.average_degree].map((_v, i) => ({
                                xAxisIndex: i,
                                yAxisIndex: i,
                                name: v.label,
                                data: [_v],
                                type: 'bar',
                                label: {
                                    show: true
                                }
                            }))).flat()
                        }, true)
                    }
                },
                myRestore: {
                    show: true,
                    title: '重置视图',
                    icon: 'path://"M562.368 797.397333l-1.216 0.149334 5.333333-0.64-2.773333 0.32 2.965333-0.362667-0.213333 0.042667 0.277333-0.042667 1.130667-0.192 0.256-0.042667 1.472-0.170666 3.114667-0.469334-0.64 0.106667 1.344-0.234667 3.541333-0.576-1.472 0.256 0.789333-0.106666 1.770667-0.32 0.405333-0.085334 1.066667-0.192 0.64-0.085333 2.709333-0.512 1.706667-0.362667-1.344 0.298667 3.157333-0.64 2.88-0.576 1.152-0.277333-0.874666 0.213333 1.749333-0.405333 0.170667-0.064 0.341333-0.064 0.682667-0.106667 0.704-0.192 2.368-0.533333 2.901333-0.704-2.965333 0.704 3.413333-0.810667 1.152-0.298667-1.109333 0.277334 1.130666-0.277334 1.493334-0.362666 1.557333-0.426667 1.386667-0.384h0.149333l0.64-0.192 0.96-0.298667 1.621333-0.426666 1.216-0.362667 0.384-0.106667 1.856-0.512 0.490667-0.192 1.856-0.554666 0.554667-0.128 1.28-0.426667 1.621333-0.490667 0.213333-0.064 2.986667-0.96 2.944-1.002666 2.773333-0.96 0.597334-0.213334 2.645333-0.96 1.472-0.576-0.704 0.277334 1.152-0.426667 1.877333-0.704 1.408-0.533333 0.874667-0.341334 1.685333-0.64 1.472-0.618666 1.792-0.746667 0.213334-0.085333 1.578666-0.661334 0.405334-0.170666 3.050666-1.301334 1.322667-0.576 1.962667-0.874666 0.96-0.426667 0.362666-0.170667 0.042667-0.021333 2.090667-0.96 0.213333-0.106667 1.92-0.874666 2.858667-1.408 0.426666-0.213334 2.453334-1.194666 1.386666-0.704 2.325334-1.216 0.512-0.234667 2.389333-1.28 0.853333-0.448 2.048-1.130667 1.194667-0.64 1.130667-0.618666 2.816-1.6-2.816 1.578666 2.922666-1.642666 2.005334-1.194667-2.048 1.194667 2.368-1.365334 0.810666-0.448c1.706667-1.002667 3.370667-2.026667 5.034667-3.050666l-1.984 1.173333 4.266667-2.602667 2.816-1.792 4.16-2.752 1.216-0.810666 2.133333-1.472 1.493333-1.045334 1.066667-0.725333 0.405333-0.298667 0.917334-0.661333 1.173333-0.810667 2.496-1.813333 0.426667-0.341333 0.149333-0.106667 1.770667-1.322667 0.277333-0.213333 0.170667-0.106667 2.432-1.856 0.277333-0.234666 1.386667-1.088 3.328-2.624 4.906666-4.053334 2.389334-1.984 1.344-1.216 0.469333-0.405333 0.384-0.341333 0.149333-0.085334c2.901333-2.56 5.76-5.162667 8.597334-7.829333l3.925333-3.797333 3.84-3.861334 1.792-1.856 1.792-1.856 2.112-2.24v-0.021333l2.154667-2.346667 1.152-1.28 0.682666-0.746666 0.32-0.362667 0.448-0.533333 1.578667-1.792 1.685333-1.941334 0.256-0.298666 1.536-1.834667 0.384-0.426667 0.448-0.533333 1.898667-2.346667-0.554667 0.704 0.704-0.874666 1.408-1.706667 2.069334-2.602667 0.021333-0.085333 0.768-0.981333 0.704-0.853334-1.493333 1.92c2.474667-3.157333 4.906667-6.4 7.253333-9.642666l1.194667-1.706667 0.661333-0.896 1.834667-2.645333-0.938667 1.301333 4.608-6.741333a298.24 298.24 0 0 0 9.386667-15.253334l0.981333-1.813333-0.021333 0.064a70.4 70.4 0 0 0 1.066666-1.856l-0.554666 0.896 1.664-2.901333a297.216 297.216 0 0 0 15.189333-32.341334l1.770667-4.522666a296.256 296.256 0 0 0 9.173333-28.522667l1.408-5.418667a296.362667 296.362667 0 0 0 8.533333-61.653333l0.149334-10.090667-0.064-6.656a297.557333 297.557333 0 0 0-13.205334-81.557333h66.453334c7.082667 28.245333 10.816 57.792 10.816 88.213333 0 197.632-158.357333 358.272-355.114667 361.941334l-6.869333 0.064-6.890667-0.064a360.789333 360.789333 0 0 1-246.784-103.68v82.730666h-64v-208h186.005333v64H273.066667v0.810667h46.464c47.914667 59.434667 116.714667 92.629333 208.469333 100.181333l4.096-0.042666 4.181333-0.085334 4.928-0.213333 1.173334-0.064-1.066667 0.042667 1.109333-0.064 1.216-0.042667 1.386667-0.085333 1.109333-0.064-0.832 0.042666 1.386667-0.064c4.842667-0.32 9.664-0.768 14.442667-1.322666l0.704-0.085334 0.490666-0.085333 0.426667-0.042667-0.298667 0.042667 0.362667-0.021333-0.469333 0.042666z m-19.221333 1.642667l-0.704 0.042667-0.042667 0.021333 0.746667-0.064z m2.176-0.106667l-0.277334 0.021334-1.898666 0.085333 2.176-0.106667z m3.925333-0.277333l-2.56 0.213333-0.533333 0.021334 3.093333-0.213334z m12.864-1.216l-0.256 0.021333-0.234667 0.021334 0.490667-0.042667z m0.362667-0.064h-0.128l-0.234667 0.064 0.256-0.042667h0.106667z m4.373333-0.533333l-0.106667 0.021333h-0.064l0.170667-0.021333z m1.109333-0.170667h-0.085333l-0.512 0.085333 0.597333-0.085333z m3.050667-0.426667l-2.88 0.384-0.170667 0.042667 3.050667-0.426667z m2.666667-0.405333l-0.256 0.021333-0.704 0.128 0.96-0.149333z m6.144-1.024l-0.298667 0.021333-0.661333 0.128-0.405334 0.064-1.344 0.256 1.749334-0.32 0.96-0.149333z m27.498666-6.336l-1.045333 0.277333-0.917333 0.277334 1.962666-0.554667z m3.797334-1.066667l-1.621334 0.448-0.341333 0.085334 1.962667-0.533334z m5.333333-1.664l-0.917333 0.298667-1.045334 0.341333 1.962667-0.64z m15.530667-5.333333l-0.746667 0.256-0.448 0.149333 1.194667-0.405333z m1.962666-0.789333l-0.832 0.341333-0.874666 0.32 1.706666-0.64z m24.576-10.773334l-0.768 0.384-0.106666 0.064 0.874666-0.426666z m13.290667-6.954666l-0.896 0.469333-0.832 0.469333 1.728-0.938666zM275.626667 340.992l-0.405334 0.64 0.106667-0.149333 0.298667-0.490667z m43.754666-53.482667l-2.752 2.709334 2.773334-2.709334z m90.922667-60.373333l-0.810667 0.341333 0.277334-0.149333 0.533333-0.213333z m87.850667-22.272l-1.386667 0.149333-0.512 0.021334 1.898667-0.170667z m0.554666-0.064l-0.554666 0.064 0.490666-0.064h0.064z m0.32-0.021333l-0.384 0.021333-0.106666 0.042667-0.384 0.021333-1.984 0.192h0.085333-0.213333 0.128l-0.192 0.021333-1.066667 0.128-4.608 0.512 3.114667-0.362666-6.890667 0.853333-6.826667 1.002667-3.136 0.512 1.258667-0.213334-2.816 0.490667-1.045333 0.170667-1.749334 0.32-5.290666 1.045333-6.250667 1.344-1.6 0.362667-4.821333 1.152a295.786667 295.786667 0 0 0-7.978667 2.133333l0.832-0.256-1.792 0.512-2.56 0.746667-0.149333 0.042666-3.050667 0.917334-0.554667 0.149333-0.682666 0.213333-2.986667 0.938667-5.013333 1.685333a295.722667 295.722667 0 0 0-17.365334 6.549334l-1.216 0.469333 0.810667-0.32-0.832 0.32-0.362667 0.170667-1.578666 0.661333-0.704 0.32 0.426666-0.170667-1.984 0.853334h-0.021333l-1.408 0.64-2.304 1.024-0.149333 0.064-0.32 0.149333-2.133334 0.981333-3.050666 1.450667-0.085334 0.021333-2.837333 1.386667-0.896 0.448-1.578667 0.789333-0.128 0.064-1.109333 0.554667-1.941333 1.024-1.258667 0.64-1.066667 0.576-0.853333 0.448-0.512 0.256-0.704 0.384-0.149333 0.085333-0.682667 0.384-0.149333 0.085334a297.493333 297.493333 0 0 0-13.376 7.744l-0.448 0.277333-0.042667 0.021333-1.877333 1.173334-2.346667 1.493333-2.816 1.834667-0.490667 0.32-0.192 0.106666-2.517333 1.706667-0.149333 0.085333-2.090667 1.429334-1.557333 1.066666 1.066666-0.725333-4.522666 3.2-0.021334 0.021333-0.362666 0.256-1.962667 1.429334-2.325333 1.728-0.256 0.192-0.554667 0.426666-1.685333 1.258667 1.685333-1.258667-4.693333 3.626667a299.434667 299.434667 0 0 0-6.442667 5.205333l-1.130667 0.96-2.133333 1.813334-0.682667 0.554666-6.186666 5.504a299.84 299.84 0 0 0-18.88 18.816l-5.824 6.528-2.901334 3.413334-0.426666 0.490666-1.92 2.346667-1.941334 2.368-1.088 1.365333-1.173333 1.493334-1.813333 2.346666-1.344 1.770667-0.149334 0.213333-0.277333 0.32-1.216 1.664-0.341333 0.448-2.005334 2.773334-0.981333 1.344-0.832 1.152 0.064-0.064-0.533333 0.789333-1.344 1.92-0.896 1.28-0.832 1.237333-0.085334 0.149334-0.234666 0.32-1.237334 1.856-0.298666 0.490666-1.365334 2.090667-0.853333 1.322667-0.149333 0.234666-3.648 5.909334-4.437334 7.594666-4.224 7.722667c-0.725333 1.386667-1.450667 2.773333-2.154666 4.202667l-0.384 0.704-0.042667 0.128-1.109333 2.197333 1.109333-2.218667-2.709333 5.546667a296.533333 296.533333 0 0 0-2.986667 6.485333l-0.426667 0.981334-0.192 0.384-0.256 0.597333a296.085333 296.085333 0 0 0-20.416 67.413333l-0.981333 5.888a297.962667 297.962667 0 0 0-3.562667 46.272c0 30.549333 4.608 60.053333 13.141334 87.808H175.488a362.794667 362.794667 0 0 1-10.730667-87.808c0-24.32 2.389333-48.064 6.954667-71.018666 33.002667-165.930667 179.413333-290.986667 355.050667-290.986667 93.504 0 178.752 35.456 242.986666 93.674667V128.512h64v208h-185.984v-64h56.426667c-43.456-38.4-99.754667-61.013333-169.877333-68.181333l-8.810667-0.810667-5.056 0.064-5.184 0.149333-2.624 0.106667h-0.384l-0.469333 0.042667h0.170666l0.298667-0.042667h0.576H512.277333l-0.192 0.021333h-0.128l-0.384 0.021334h-0.085333l-0.128 0.021333h-0.128l-0.234667 0.021333-0.981333 0.064 0.512-0.042666h0.469333l0.277334-0.042667h0.512l-1.258667 0.042667-1.194667 0.085333-3.157333 0.170667 3.84-0.213334-0.618667 0.021334-3.285333 0.213333-0.981333 0.042667-2.133334 0.192-1.408 0.085333-1.237333 0.106667h0.149333l1.088-0.106667 0.64-0.021333-1.728 0.106666-0.362666 0.064-1.109334 0.085334z m6.826667-0.533334l-2.816 0.213334 2.090667-0.192 0.725333-0.021334z m5.184-0.32l-1.642667 0.085334 1.322667-0.085334h0.32z m0.277333 0l0.128-0.042666h0.64l0.106667-0.042667h0.64-0.64l-0.746667 0.042667-0.405333 0.042666h0.277333z m51.904 593.344l-0.021333 0.021334h-0.085333 0.106666l0.405334-0.064-0.362667 0.064h-0.042667z m29.141334-5.034666l-0.554667 0.128-0.170667 0.021333 0.725334-0.149333z',
                    onclick: e => {
                        this.setRadar()
                    }
                },
                myExport: {
                    show: true,
                    title: '导出数据',
                    icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                    onclick: e => {
                        fetch(host + '/result/ExportRadarPath' +
                            '?model_id=' + this.props.mid)
                            .then(r => r.json())
                            .then(res => {
                                if (res.resultCode == 1000) {
                                    res = res.data.split('Web_NEview')[1]
                                    _.download(host + res)
                                }
                            })
                    }
                },
            }
        }
        this.chart.setOption({
            tooltip: {
            },
            toolbox,
            legend: {
                data: categories,
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
        this.modal = echarts.init(this.modalRef.current)
        this.init()
    }
    componentWillReceiveProps(props) {
        this.init(props)
    }

    SankeyGroups = () => {
        const groups = this.props.groups || []
        const ptr = $('#skg-' + this.state.group)[0]
        const [activeBlock, setActBlock] = useState(0)
        const sorter = (key) => {
            groups[activeBlock].sort((a, b) => (a._origin_[key] - b._origin_[key]))
            this.props.setState(groups)
        }
        return (
            <div
                className={style.skg}
                style={{
                    width: '77.35%'
                }}
            >
                <div className={style['skg-block']}>
                    {groups.map((v, i) => (
                        <div
                            style={{
                                position: 'relative'
                            }}
                            id={'skg-' + i}
                            key={i}
                            onMouseEnter={e => this.setState({ group: i })}
                            onClick={e => {
                                if (activeBlock !== i)
                                    setActBlock(i)
                                else
                                    setActBlock(0)
                            }}
                        >
                            {i}
                            <div className={ClassNames(style['skg-menu'], activeBlock === i && style.active)}>
                                <div
                                    onClick={e => {
                                        this.props.setState({
                                            on: 'group',
                                            group: '' + i
                                        })
                                        this.props.getGroupData(i)
                                    }}
                                >
                                    查看年份
                                </div>
                                <div
                                    onClick={e => sorter('density')}
                                >
                                    密度排序
                                </div>
                                <div
                                    onClick={e => sorter('centrality')}
                                >
                                    中心度排序
                                </div>
                                <div
                                    onClick={e => sorter('num')}
                                >
                                    节点数排序
                                </div>
                            </div>
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
    RadarChanger = () => {
        return (
            <div className={style['rd-excg']}>
                <img src={imgs.exchangeSvg} />
            </div>
        )
    }

    render() {
        return (
            <div
                className={style.main}
                title={this.props.title}
            >
                <div ref={this.chartRef} />
                <div className={ClassNames(style.modal, this.state.modalOn && style.active)}>
                    <div
                        className={style['modal-mask']}
                        onClick={e => this.setState({ modalOn: false })}
                    />
                    <div className={style['modal-content']}>
                        <div ref={this.modalRef} />
                    </div>
                </div>
                {this.props.type === 'main' && <this.SankeyGroups />}
            </div>
        )
    }
}
