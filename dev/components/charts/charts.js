import React, { Component, PureComponent } from 'react'
import echarts from 'echarts'
import style from './charts.css'

export default class Charts extends PureComponent {
    constructor(props) {
        super(props)
        this.canvas = React.createRef()
        
    }
    
    componentWillReceiveProps() {
        this.chart = echarts.init(this.canvas.current)
        this.chart.setOption({
            
        })
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvas} />
            </div>
        )
    }
}
