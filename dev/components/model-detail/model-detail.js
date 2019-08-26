import React, { Component } from 'react'

import { Tabs, Table, Row, Col, Statistic, Icon } from 'antd'
const { TabPane } = Tabs, { Column } = Table

import SvgGraph from '../Svg-graph/graph'

import SankeyData from '../../../static/source.json'
import ScatterData from '../../../static/zp.json'

import style from './model-detail.css'

export default class ModelDetail extends Component {
    constructor(props) {
        super(props)

        this.graphData = { 'sankey': SankeyData, 'circular': SankeyData, 'scatter': ScatterData, } //'circle-flow': CircleFlowData }
        this.state = {
            graph: 'sankey',
            node: {}
        }
    }

    render() {
        const { state } = this
        return (
            <div className={style.main}>
                <div className={style.graph}>
                    <Tabs defaultActiveKey={state.graph} onChange={key => state.node.name && this.setState({ graph: key })}
                        tabBarExtraContent={<span>{`${state.node.name || ''}.${state.node.year || ''}`}</span>}>
                        <TabPane tab='网络流形' key="sankey" />
                        <TabPane tab={<span><Icon style={{ color: state.node.name ? '#1890ff' : '' }} type='dot-chart' />ZP分布</span>} key="scatter" />
                        <TabPane tab={<span><Icon style={{ color: state.node.name ? '#1890ff' : '' }} type='dot-chart' />社区演化</span>} key="circle-flow" />
                    </Tabs>
                    <SvgGraph graph={state.graph} data={this.graphData[state.graph]} handleSelectNode={info => this.setState({ node: info })} />
                </div>
                <div className={style.table}>
                    <div>
                        <Icon type='bar-chart' />
                        <span>社区信息</span>
                    </div>
                    <Table dataSource={new Array(100).fill(0)} bordered pagination={false} scroll={{ y: 480 }}
                        title={() => (
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic title="社区ID" value={1128} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="元素数量" value={93} />
                                </Col>
                            </Row>)}>
                        <Column title="词汇" dataIndex="word" key="word" />
                        <Column title="Z-value" dataIndex="zv" key="zv" />
                        <Column title="P-value" dataIndex="pv" key="pv" />
                        <Column title="frequency" dataIndex="fre" key="fre" />
                    </Table>
                </div>
            </div>
        )
    }
}
