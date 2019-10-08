import React, { Component, PureComponent } from 'react'
import echarts from 'echarts'
import style from './charts.css'
import { isNumber } from 'util'

export default class Charts extends PureComponent {
    constructor(props) {
        super(props)
        this.canvas = React.createRef()
        this.maps = {
            'dbMap': this.setDbMap.bind(this),
            'force': this.setForce.bind(this),
            'radar': this.setRadar.bind(this)
        }
    }

    setDbMap() {
        const clusters = []
        this.props.data.forEach(v => {
            let pclst = clusters.findIndex(clst => clst.name === v.clusterName)
            pclst === -1 &&
                (pclst = clusters.push({
                    name: v.clusterName,
                    id: v.clusterId,
                    label: {
                        show: true
                    },
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
                        label: {
                            show: true
                        },
                    })
                }
                if (!(clst.links[`${'n' + v.source_nodeName}_${'n' + t.target_nodeName}`] &&
                    clst.links[`${'n' + v.target_nodeName}_${'n' + t.source_nodeName}`])) {
                    clst.links[`${'n' + v.source_nodeName}_${'n' + t.target_nodeName}`] = true
                    const ps = clst.nodes['n' + v.source_nodeName], pt = clst.nodes['n' + t.target_nodeName]
                    clst.links.push({
                        source: ps,
                        target: pt
                    })
                    if (clst.nodes[ps].symbolSize < 20)
                        clst.nodes[ps].symbolSize += 3
                    else if (clst.nodes[ps].symbolSize < 40)
                        clst.nodes[ps].symbolSize += 1
                    else if (clst.nodes[ps].symbolSize < 60)
                        clst.nodes[ps].symbolSize += 0.1
                }
            })
            clst.catagory = pclst
            clst.symbolSize = Math.sqrt(clst.nodes.length) + 25
        })
        const categories = clusters.map(v => ({ name: v.name }))
        const option = {
            legend: [{
                type: 'scroll',
                left: 'left',
                orient: 'vertical',
                data: categories.map(ctgr => ctgr.name),
            }],
            series: [{
                name: "cluster map",
                type: 'graph',
                layout: 'force',
                force: {
                    // 使用默认值
                },
                zlevel: 0,
                data: clusters,
                links: [],
                categories,
                roam: true,
                focusNodeAdjacency: true,
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 1,
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    }
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3
                },
                emphasis: {
                    lineStyle: {
                        width: 10
                    }
                }
            }]
        }
        this.chart.setOption(option)
        this.chart.on('click', params => {
            if (params.seriesName === 'cluster map') {
                this.chart.showLoading()
                const clst = clusters.find(v => v.name === params.data.name)
                this.clst = clst
                option.legend[1] = {
                    show: true,
                    left: 'center',
                    selectedMode: 'single',
                    selected: { 'cluster map': false, 'cluster map2': true },
                    data: ['cluster map', 'cluster map2']
                }
                option.series[1] = {
                    name: 'cluster map2',
                    type: 'graph',
                    layout: 'force',
                    force: {
                        repulsion: [1, 100],
                        edgeLength: [10, 500],
                        layoutAnimation: false
                    },
                    zlevel: 1,
                    data: clst.nodes,
                    links: clst.links,
                    categories,
                    roam: true,
                    focusNodeAdjacency: true,
                }
                this.chart.setOption(option)
                this.chart.hideLoading()
            } else if (params.seriesName === 'cluster map2') {
                this.chart.showLoading()
                this.props.getClusterData(this.clst.id)
            }
        })
    }
    setForce() {
        // todo
    }
    setRadar() {
        this.chart.setOption({
            title: {
                // text: '基础雷达图'
            },
            tooltip: {},
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
                    { name: '（edge_num）', max: this.props.data.reduce((acc, v) => acc > v.edge_num ? acc : v.edge_num, 0) },
                    { name: '（max_degree', max: this.props.data.reduce((acc, v) => acc > v.max_degree ? acc : v.max_degree, 0) },
                    { name: '（density）', max: this.props.data.reduce((acc, v) => acc > v.density ? acc : v.density, 0) },
                    { name: '（community_num）', max: this.props.data.reduce((acc, v) => acc > v.coummunity_num ? acc : v.coummunity_num, 0) },
                    { name: '（node_num）', max: this.props.data.reduce((acc, v) => acc > v.node_num ? acc : v.node_num, 0) },
                    { name: '（average_degree）', max: this.props.data.reduce((acc, v) => acc > v.average_degree ? acc : v.average_degree, 0) }
                ]
            },
            series: [{
                name: '',
                type: 'radar',
                data: this.props.data.map(v => ({
                    value: [v.edge_num, v.max_degree, v.density, v.coummunity_num, v.node_num, v.average_degree], // todo
                    name: v.label
                }))
            }]
        })
    }

    init() {
        this.chart = echarts.init(this.canvas.current)//, null, {renderer: 'svg'})
        this.chart.showLoading()
        this.maps[this.props.type]()
        this.chart.hideLoading()
    }
    componentDidMount() {
        this.init()
    }
    componentWillReceiveProps() {
        // this.init()
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvas} width={this.props.width} height={this.props.height} />
            </div>
        )
    }
}
