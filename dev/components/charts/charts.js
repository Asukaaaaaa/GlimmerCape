import React, { Component, PureComponent } from 'react'
import echarts from 'echarts'
import style from './charts.css'

export default class Charts extends PureComponent {
    constructor(props) {
        super(props)
        this.canvas = React.createRef()
        this.maps = {
            'force': this.setForce.bind(this),
            'radar': this.setRadar.bind(this)
        }
    }

    setForce() {
        this.chart.showLoading();
        const catagory = [], nodes = [], links = []
        this.props.data.forEach(v => {
            const srcId = nodes.length
            nodes.push({
                catagory: catagory.length - 1,
                id: srcId,
                name: v.source_nodeName,
                value: 1
            })
            v.target.forEach(t => {
                links.push({
                    source: srcId,
                    target: nodes.length
                })
                nodes.push({
                    catagory: catagory.length - 1,
                    id: nodes.length,
                    name: t.target_nodeName,
                    value: 1
                })
            })
            catagory.push({
                name: v.clusterName,
                keyword: {}
            })
        })
        this.chart.hideLoading()
        this.chart.setOption({
            legend: {
                data: this.props.data.map(v => v.clusterName)
            },
            series: [{
                type: 'graph',
                layout: 'force',
                animation: false,
                label: {
                    normal: {
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                draggable: false,
                data: nodes,
                categories: catagory,
                force: {
                    // initLayout: 'circular'
                    // repulsion: 20,
                    edgeLength: 5,
                    repulsion: 20,
                    gravity: 0.2
                },
                edges: links
            }]
        })
    }
    setRadar() {
        this.chart.setOption({
            title: {
                // text: '基础雷达图'
            },
            tooltip: {},
            legend: {
                data: this.props.data.map(v => v.label)
            },
            radar: {
                // shape: 'circle',
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
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                // areaStyle: {normal: {}},
                data: this.props.data.map(v => ({
                    value: [v.edge_num, v.max_degree, v.density, v.coummunity_num, v.node_num, v.average_degree], // todo
                    name: v.label
                }))
            }]
        })
    }

    init() {
        this.chart = echarts.init(this.canvas.current)//, null, {renderer: 'svg'})
        this.maps[this.props.type]()
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
