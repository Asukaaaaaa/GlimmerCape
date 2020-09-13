import React, { Component, PureComponent, useState, useEffect } from 'react'
import echarts from 'echarts'
//
import Table, { Column } from '../table/table'
import { _, imgs, ClassNames, _BASE } from '../../utils'
//styles
import style from './charts.css'
import './charts.less'



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
            'radar': this.setRadar,
            'scatter': this.setScatter
        }
    }
    setSankey = ({
        group,
        getGroupData, getClusterData,
        setState, groups, links
    }) => {
        const categories = groups.map((g, i) => i).flat()
        const option = {
            tooltip: {},
            backgroundColor: 'white',
            series: [{
                name: 'main map',
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
        this.chart.on('click', _.debounce(({ seriesName, dataType, data }) => {
            if (seriesName == 'main map' &&
                dataType === 'node') {
                const _nodes = [], _links = []
                const collectors = groups.map(g => g.collector).flat()
                const years = collectors.map(c => c.id)
                for (let i = 0; i < years.length - 1; ++i)
                    _links.push({
                        source: years[i],
                        target: years[i + 1],
                        lineStyle: {
                            opacity: 0
                        }
                    })
                _nodes.mypush = function (v) {
                    if (v &&
                        !this[v.id]) {
                        this[v.id] = true
                        const vgroup = v._origin_.group
                        if (vgroup > years[0])
                            _links.push({
                                source: Number.parseInt(vgroup) - 1 + '',
                                target: v.id,
                                lineStyle: {
                                    opacity: 0
                                }
                            })
                        if (vgroup < years[years.length - 1])
                            _links.push({
                                source: v.id,
                                target: Number.parseInt(vgroup) + 1 + '',
                                lineStyle: {
                                    opacity: 0
                                }
                            })
                        Array.prototype.push.call(this, v)
                    }
                }
                const nodesMap = groups.nodesMap
                groups.forEach(g => _nodes.mypush(g.find(cl => cl.name == data._origin_.name)))
                links.forEach(l => {
                    if (l.source.includes(data._origin_.name) &&
                        nodesMap.has(l.target)) {
                        _links.push(l)
                        _nodes.mypush(nodesMap.get(l.target))
                    } else if (
                        l.target.includes(data._origin_.name) &&
                        nodesMap.has(l.source)) {
                        _links.push(l)
                        _nodes.mypush(nodesMap.get(l.source))
                    }
                })
                this.modal.on('click', ({ seriesName, dataType, data }) => {
                    if (dataType === 'node') {
                        this.setState({
                            modalOn: false
                        })
                        setState({
                            on: 'cluster',
                            group: data._origin_.group,
                            cluster: data._origin_
                        })
                        getClusterData(data._origin_)
                    }
                })
                this.modal.on('mouseover', ({ seriesName, dataType, data }) => {
                    if (dataType === 'node') {
                        if (group !== data._origin_.group)
                            this.setState({
                                group: data._origin_.group
                            })
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
                        data: _nodes.concat(collectors),
                        links: _links,
                        focusNodeAdjacency: 'allEdges',
                        draggable: false,
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
                }, true)
                this.modal.hideLoading()
            }
        }))
        this.chart.on('mouseover', ({ seriesName, dataType, data }) => {
            if (seriesName == 'main map' &&
                dataType === 'node') {
                if (group !== data._origin_.group)
                    this.setState({
                        group: data._origin_.group
                    })
            }
        })
        this.chart.setOption(option, true)
        this.setState({
            controlSetting: {
                name: '主题演化图',
                panel: [],
                sub: []
            }
        })
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
        this.setState({
            controlSetting: {
                name: '社区图',
                //panel: [],
                sub: []
            }
        })
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
        this.setState({
            controlSetting: {
                name: '共词网络图',
                //panel: [],
                sub: []
            }
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
                                max: limits[i].toFixed(4),
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
                            series: this.props.data.map(v => [v.edge_num, v.max_degree, v.density, v.coummunity_num, v.node_num, v.average_degree]
                                .map((_v, i) => ({
                                    xAxisIndex: i,
                                    yAxisIndex: i,
                                    name: v.label,
                                    data: [_v],
                                    type: 'bar',
                                    label: {
                                        show: true,
                                        formatter: param => _.num2e(param.value)
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
                        fetch(_BASE + '/result/ExportRadarPath' +
                            '?model_id=' + this.props.mid)
                            .then(r => r.json())
                            .then(res => {
                                if (res.resultCode == 1000) {
                                    res = res.data.split('Web_NEview')[1]
                                    _.download(_BASE + res, '社区数据表')
                                }
                            })
                    }
                },
            }
        }
        this.chart.setOption({
            tooltip: {
                formatter: param => {
                    const value = param.value.map(v => _.num2e(v))
                    return '边数: ' + value[0] + '<br>' +
                        '最大度： ' + value[1] + '<br>' +
                        '密度： ' + value[2] + '<br>' +
                        '社区数： ' + value[3] + '<br>' +
                        '节点数： ' + value[4] + '<br>' +
                        '平均度： ' + value[5]
                }
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
                    value: [v.edge_num, v.max_degree, v.density, v.coummunity_num, v.node_num, v.average_degree].map(_v => _v.toString()),
                    name: v.label
                }))
            }]
        }, true)
        this.setState({
            controlSetting: {
                name: '雷达图',
                //panel: [],
                sub: [{
                    icon: (
                        <svg t="1575201808656" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2242" width="200" height="200">
                            <path d="M818.752 704H128a32 32 0 1 1 0-64h768a32 32 0 0 1 22.656 54.656l-192 192a32 32 0 0 1-45.312-45.312L818.752 704zM128 448a31.872 31.872 0 0 1-22.656-54.656l192-192a32 32 0 1 1 45.312 45.312L205.248 384H896a32 32 0 1 1 0 64H128z" p-id="2243"></path>
                        </svg>
                    ),
                    onclick: e => this.setState({ rdcOn: !this.state.rdcOn })
                }]
            }
        })
    }
    setScatter = () => {
        const { data } = this.props
        this.chart.setOption({
            tooltip: {
                formatter: params => `weight: ${params.value[0].toFixed(4)}<br>height: ${params.value[1].toFixed(4)}`,
                axisPointer: {
                    show: true,
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            xAxis: {},
            yAxis: {},
            series: [{
                symbolSize: 10,
                itemStyle: {
                    color: 'black'
                },
                data: data.black,
                type: 'scatter'
            }, {
                symbolSize: 10,
                itemStyle: {
                    color: 'green'
                },
                data: data.greeen,
                type: 'scatter'
            }, {
                symbolSize: 10,
                itemStyle: {
                    color: 'red'
                },
                data: data.red,
                type: 'scatter'
            }, {
                symbolSize: 10,
                itemStyle: {
                    color: 'blue'
                },
                data: data.blue,
                type: 'scatter'
            }]
        })
        this.setState({
            controlSetting: {
                name: 'zp图',
                //panel: [],
                sub: []
            }
        })
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
    render() {
        return (
            <div className={style.main} title={this.props.title}>
                <div ref={this.chartRef} />
                <div className={ClassNames(style.modal, this.state.modalOn && style.active)}>
                    <div className={style['modal-mask']}
                        onClick={e => this.setState({ modalOn: false })} />
                    <div className={style['modal-content']}>
                        <div ref={this.modalRef} />
                    </div>
                </div>
                {this.props.type == 'main' && <this.SankeyGroups />}
                {this.props.type == 'radar' && <this.RadarChart {...this.state} />}
                <this.Controls {...this.state.controlSetting} />
            </div>
        )
    }

    SankeyGroups = () => {
        const groups = this.props.groups || []
        const [ptr, setPtr] = useState()
        const [activeBlock, setActBlock] = useState(0)
        useEffect(() => {
            setPtr($('#skg-' + this.state.group)[0])
        })
        const sorter = (key) => {
            groups[activeBlock].sort((a, b) => (a._origin_[key] - b._origin_[key]))
            this.props.setState(groups)
        }
        return (
            <div className={ClassNames(style.skg, this.state.modalOn && style['modal-on'])}
                onTransitionEnd={e => {
                    e.target.className.includes('skg-ptr') ||
                        setPtr()
                }}>
                <div className={style['skg-block']}>
                    {groups.map((v, i) => (
                        <div id={'skg-' + i} key={i}
                            style={{
                                position: 'relative'
                            }}
                            onMouseEnter={e => this.setState({ group: i })}
                            onClick={e => {
                                if (activeBlock !== i)
                                    setActBlock(i)
                                else
                                    setActBlock(0)
                            }}>
                                <a style={{color: 'black'}}>{i}</a>
                            <div className={ClassNames(style['skg-menu'], activeBlock === i && style.active)}>
                                <div onClick={e => {
                                    this.props.setState({
                                        on: 'group',
                                        group: '' + i
                                    })
                                }}>
                                    <a style={{color: 'black'}}>查看年份</a>
								</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={style['skg-ptr']}
                    style={{
                        transition: this.state.modalOn || 'transform 0.25s ease-in-out',
                        transform: `translateX(${ptr ? ptr.offsetLeft : 0}px)`
                    }} />
            </div>
        )
    }
    RadarChart = ({ rdcOn }) => {
        return (
            rdcOn &&
            <div className={style['rd-ct']}>
                <Table name='' data={this.props.data}>
                    <Column title='年份' dataIndex='label' key='-1' />
                    {[
                        ['edge_num', '边数'],
                        ['max_degree', '最大度'],
                        ['average_degree', '平均度'],
                        ['density', '密度'],
                        ['coummunity_num', '社区数'],
                        ['node_num', '节点数']
                    ].map((v, i) => (
                        <Column title={v[1]} number dataIndex={v[0]} key={i}
                            sorter={(a, b) => b[v[0]] - a[v[0]]} />
                    ))}
                </Table>
            </div> ||
            null
        )
    }
    Controls = ({ name, panel, sub }) => {
        const [active, setActive] = useState(true)
        const [sortKey, setSortKey] = useState()
        const handleSort = key => {
            setSortKey(key)
            const { groups } = this.props
            groups.forEach(g => g.sort((a, b) => (b._origin_[key] - a._origin_[key])))
            this.props.setState(groups)
        }
        return (
            <div className={ClassNames('ct-controls', active && 'active')}>
                <div className='cc-button'
                    onClick={e => setActive(!active)}>
                    <svg t="1576331390440" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2459" width="64" height="64">
                        <path d="M507.008 642.673778c-72.049778 0-130.673778-58.609778-130.673778-130.673778 0-72.049778 58.609778-130.673778 130.673778-130.673778 72.035556 0 130.673778 58.624 130.673778 130.673778 0 72.064-58.624 130.673778-130.673778 130.673778z m0-204.458667c-40.675556 0-73.784889 33.095111-73.784889 73.784889s33.095111 73.784889 73.784889 73.784889 73.784889-33.095111 73.784889-73.784889-33.095111-73.784889-73.784889-73.784889z" fill="#333333" p-id="2460"></path><path d="M510.762667 974.222222h-2.744889c-51.911111 0-98.958222-39.082667-115.555556-93.468444a383.089778 383.089778 0 0 1-64.512-26.752c-21.304889 11.975111-44.871111 18.446222-67.939555 18.446222-29.738667 0-57.102222-10.993778-77.056-30.961778l-2.446223-2.588444c-36.138667-36.124444-41.585778-97.038222-14.705777-147.299556-10.695111-20.48-18.119111-42.325333-25.144889-65.208889-54.471111-16.455111-90.88-61.525333-90.88-112.64v-2.744889c0-51.299556 36.380444-96.64 90.794666-113.294222 7.381333-24.433778 15.687111-46.791111 26.680889-67.626666-27.633778-49.792-23.495111-108.145778 12.615111-144.270223l1.792-1.976889c20.792889-20.792889 49.692444-32.270222 81.507556-32.270222a141.795556 141.795556 0 0 1 67.086222 17.223111 383.530667 383.530667 0 0 1 60.245334-24.931555C404.750222 89.059556 452.352 49.777778 508.017778 49.777778h2.744889c54.883556 0 99.982222 38.599111 113.208889 94.222222a384.497778 384.497778 0 0 1 60.984888 25.358222 129.664 129.664 0 0 1 65.379556-17.948444c32.170667 0 62.122667 12.231111 84.352 34.446222l1.464889 1.351111c39.424 39.409778 44.145778 98.645333 14.250667 147.256889 10.382222 19.825778 20.423111 40.007111 26.979555 60.330667 55.537778 13.141333 96.853333 60.188444 96.853333 116.209777v2.744889c0 55.722667-41.329778 102.499556-96.924444 115.498667-6.229333 18.958222-15.189333 38.272-25.329778 57.770667 29.340444 48.967111 23.281778 110.791111-16.455111 150.542222l-2.076444 3.029333C812.131556 861.866667 783.616 874.666667 753.536 874.666667h0.028444c-22.769778 0-45.710222-7.808-66.218666-20.195556-20.906667 11.079111-42.709333 19.626667-65.180445 26.638222-15.402667 55.253333-59.946667 93.112889-111.402666 93.112889z m-183.893334-181.774222c4.963556 0 9.912889 1.28 14.364445 3.882667a327.537778 327.537778 0 0 0 82.204444 34.133333c10.808889 2.816 18.958222 11.719111 20.835556 22.727111 6.129778 35.968 34.119111 64.142222 63.729778 64.142222h2.744888c32.455111 0 54.300444-32.028444 59.093334-63.672889a28.401778 28.401778 0 0 1 20.906666-23.253333 327.651556 327.651556 0 0 0 83.783112-35.057778 28.444444 28.444444 0 0 1 32.455111 2.403556c14.065778 11.463111 30.620444 17.763556 46.606222 17.777778a54.570667 54.570667 0 0 0 39.367111-16.284445l1.891556-1.905778c23.523556-23.523556 23.936-62.421333 0.938666-90.467555a28.444444 28.444444 0 0 1-2.688-32.113778c15.288889-26.837333 26.396444-53.077333 33.038222-78.051555 3.086222-11.619556 14.634667-20.053333 26.624-21.048889 36.536889-3.029333 64.554667-29.084444 64.554667-61.923556v-2.744889c0-33.223111-28.032-59.576889-64.597333-62.691555-11.960889-1.009778-22.755556-9.429333-25.827556-21.034667-7.168-27.008-18.958222-54.072889-34.275555-80.412444a28.430222 28.430222 0 0 1 2.474666-32.412445c23.438222-28.401778 24.007111-63.943111 1.507556-86.442667l-1.479111-1.351111a62.421333 62.421333 0 0 0-44.757334-18.375111c-16.369778 0-32.682667 5.888-45.923555 16.554667a28.444444 28.444444 0 0 1-32.156445 2.446222 327.324444 327.324444 0 0 0-80.654222-33.493333 28.444444 28.444444 0 0 1-21.034666-24.775111c-3.541333-36.693333-28.131556-62.336-59.832889-62.336h-2.744889c-32.896 0-60.643556 26.951111-64.497778 62.677333a28.472889 28.472889 0 0 1-21.006222 24.448 327.04 327.04 0 0 0-79.104 32.583111 28.387556 28.387556 0 0 1-30.791111-1.592889c-14.378667-10.368-32.426667-16.298667-49.521778-16.298666-16.625778 0-31.331556 5.560889-41.415111 15.644444l-1.991111 1.976889c-22.755556 22.755556-15.744 60.686222 2.929777 86.385778 6.698667 9.201778 7.267556 21.518222 1.436445 31.288889-14.876444 24.96-26.183111 52.721778-34.574222 84.835555-2.801778 10.737778-10.097778 18.858667-21.034667 20.807111-36.067556 6.428444-61.781333 32.910222-61.781333 61.596445v2.744889c0 28.387556 25.685333 54.542222 61.724444 60.856888 10.965333 1.92 19.043556 10.055111 21.859556 20.835556 7.779556 29.781333 18.759111 57.557333 33.393777 82.56a28.444444 28.444444 0 0 1-1.550222 30.833778c-21.205333 29.838222-21.546667 69.589333-0.64 90.481778l2.389334 2.574222c11.192889 11.178667 25.898667 13.667556 36.181333 13.667555 16.654222 0 34.872889-6.414222 49.991111-17.564444 4.992-3.697778 10.908444-5.560889 16.853333-5.560889z" fill="#333333" p-id="2461"></path><path d="M749.568 433.621333a14.222222 14.222222 0 0 1-13.283556-9.130666c-36.124444-94.037333-128.099556-157.212444-228.864-157.226667a14.222222 14.222222 0 1 1 0-28.444444c112.440889 0 215.096889 70.513778 255.416889 175.473777a14.236444 14.236444 0 0 1-13.269333 19.328zM269.312 638.833778a14.222222 14.222222 0 0 1-12.188444-6.883556c-2.830222-4.693333-4.096-8.163556-6.371556-14.506666-1.095111-3.000889-2.488889-6.869333-4.522667-12.188445a14.208 14.208 0 1 1 26.552889-10.197333c2.119111 5.546667 3.584 9.585778 4.707556 12.714666 2.076444 5.703111 2.673778 7.296 3.996444 9.486223a14.222222 14.222222 0 0 1-12.174222 21.575111zM501.632 780.728889a273.095111 273.095111 0 0 1-209.223111-97.322667 14.208 14.208 0 1 1 21.745778-18.332444 244.764444 244.764444 0 0 0 187.477333 87.210666 14.222222 14.222222 0 0 1 0 28.444445z" fill="#333333" p-id="2462"></path>
                    </svg>
                </div>
                {panel &&
                    <div className='cc-panel'>
                        <div className='cp-item'>
                            <span>密度排序</span>
                            <Switch value={sortKey == 'density'}
                                handleChange={(active) => active && handleSort('density')} />
                        </div>
                        <div className='cp-item'>
                            <span>中心度排序</span>
                            <Switch value={sortKey == 'centrality'}
                                handleChange={(active) => active && handleSort('centrality')} />
                        </div>
                        <div className='cp-item'>
                            <span>节点数排序</span>
                            <Switch value={sortKey == 'num'}
                                handleChange={(active) => active && handleSort('num')} />
                        </div>
                    </div>}
                {sub &&
                    <div className='cc-subpanel'>
                        {sub.map((item, k) => (
                            <div className='cp-item' key={k}
                                onClick={item.onclick}>
                                {item.icon}
                            </div>
                        ))}
                        <div className='cp-item'
                            onClick={e => {
                                const cvs = $('canvas', this.chartRef.current)[0]
                                _.download(cvs.toDataURL('image/png'), name)
                            }}>
                            <svg t="1576331450014" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2680" width="64" height="64">
                                <path d="M634.211556 469.859556h-51.427556c0.113778-0.099556 0.284444-0.142222 0.384-0.256 2.688-2.702222 4.280889-6.4 4.280889-10.097778a14.648889 14.648889 0 0 0-4.138667-10.097778c-5.248-5.262222-14.919111-5.262222-20.195555 0-2.56 2.56-4.110222 6.243556-4.110223 10.097778 0 3.697778 1.422222 7.395556 4.110223 10.097778 0.696889 0.696889 1.635556 1.109333 2.488889 1.635555a14.165333 14.165333 0 0 0 5.930666 27.064889h62.677334c9.073778 0 15.544889 4.138667 18.275555 9.756444 3.399111 6.968889 1.052444 18.033778-6.371555 27.534223l-107.562667 146.702222c-14.165333 18.090667-38.243556 15.971556-52.878222-2.702222l-108.003556-143.459556c-7.196444-9.173333-9.528889-20.380444-5.944889-27.761778 2.816-5.788444 9.244444-10.069333 18.119111-10.069333h53.660445c7.850667 0 17.024-4.195556 17.024-12.060444v-44.885334c0-31.175111 22.840889-58.538667 50.375111-58.538666 16.910222 0 37.660444 4.878222 46.762667 28.145777 2.872889 7.296 11.278222 10.951111 18.631111 8.064 7.338667-2.858667 11.278222-11.107556 8.419555-18.432-11.477333-29.368889-37.944889-46.222222-73.870222-46.222222-43.434667 0-78.734222 39.836444-78.734222 86.983111v28.501334h-42.268445c-20.053333 0-35.968 10.197333-43.690666 26.069333-8.448 17.351111-4.949333 40.376889 8.974222 58.097778l108.003555 143.160889c13.326222 16.981333 31.928889 26.723556 51.057778 26.723555 18.033778 0 34.645333-8.746667 47.047111-24.547555l107.562667-147.057778c13.923556-17.777778 17.479111-39.822222 9.258667-56.689778-7.608889-15.672889-23.608889-25.756444-43.847111-25.756444z" fill="" p-id="2681"></path><path d="M512 50.033778C257.28 50.033778 50.033778 257.265778 50.033778 512 50.033778 766.72 257.28 973.966222 512 973.966222S973.966222 766.72 973.966222 512C973.966222 257.265778 766.72 50.033778 512 50.033778z m0 867.043555C288.64 917.077333 106.922667 735.36 106.922667 512S288.64 106.922667 512 106.922667 917.077333 288.64 917.077333 512 735.36 917.077333 512 917.077333z" fill="" p-id="2682"></path><path d="M606.520889 166.954667a14.250667 14.250667 0 0 0-17.479111 9.969777c-2.062222 7.594667 2.417778 15.402667 9.969778 17.479112C741.632 233.386667 841.216 363.989333 841.216 512a14.222222 14.222222 0 0 0 28.444444 0c0-160.796444-108.188444-302.677333-263.139555-345.045333zM512.014222 182.769778a342.485333 342.485333 0 0 1 19.185778 0.526222 14.222222 14.222222 0 0 0 0.753778-28.416 370.631111 370.631111 0 0 0-19.925334-0.554667 14.222222 14.222222 0 0 0-0.014222 28.444445z" fill="" p-id="2683"></path>
                            </svg>
                        </div>
                    </div>}
            </div>
        )
    }
	/*Controls = () => {
		const [listRef] = useState(React.createRef())
		const [active, setActive] = useState(true)
		return (
			<div className={style['ct-box']}>
				<div className={style.controls}
					style={{
						transition: 'transform .3s ease-in-out',
						transform: active || `translateY(-${listRef.current.clientHeight}px)`
					}}>
					<ul ref={listRef}>
						<li>
							<div className={style.item}>
								<span>排序</span>
								<select onChange={e => {
									if (e.target.value.length) {
										const key = e.target.value
										const { groups } = this.props
										groups.forEach(g => g.sort((a, b) => (a._origin_[key] - b._origin_[key])))
										this.props.setState(groups)
									}
								}}>
									<option value=''>---</option>
									<option value='centrality'>中心度</option>
									<option value='density'>密度</option>
									<option value='num'>节点数</option>
								</select>
							</div>
						</li>
					</ul>
					<div onClick={e => setActive(!active)}>设置</div>
				</div>
			</div>
		)
	}*/
}

export const Switch = ({ value, handleChange }) => {
    const [active, setActive] = useState(false)
    useEffect(() => {
        setActive(value)
    }, [value])
    return (
        <div className={ClassNames('cp-switch', active && 'active')}>
            <div className='cs-container'
                onClick={e => {
                    setActive(!active)
                    handleChange(!active)
                }}>
                <div className='cs-slider' />
            </div>
        </div>
    )
}