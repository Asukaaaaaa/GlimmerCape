import React, { Component } from 'react'

import { Tabs, Table, Row, Col, Statistic, Icon } from 'antd'
const { TabPane } = Tabs, { Column } = Table

import SvgGraph from '../Svg-graph/graph'

import { host } from '../../util'
import style from './model-detail.css'

export default class ModelDetail extends Component {
    constructor(props) {
        super(props)

        // TODO
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
                    <Tabs defaultActiveKey={state.graph}
                        onChange={key => {
                            if (key === 'circle-flow' && !state.node.name)
                                return
                            this.setState({ graph: key })
                        }}
                        tabBarExtraContent={<span>{`${state.node.name || ''}.${state.node.year || ''}`}</span>}>
                        <TabPane tab='网络流形' key="sankey" />
                        <TabPane tab={<span><Icon type='dot-chart' />ZP分布</span>} key="scatter" />
                        <TabPane tab={<span><Icon style={{ color: state.node.name ? '#1890ff' : '' }} type='dot-chart' />社区演化</span>} key="circle-flow" />
                    </Tabs>
                    <SvgGraph graph={state.graph} data={state.clusterData}
                        handleSelectNode={info => {
                            this.setState({ node: info })
                            $.post(host + '/result/getPickedClusterInfo', {
                                model_id: this.props.match.params.id,
                                cluster_id: info.id,
                                label: info.year
                            }, res => res.resultDesc === 'Success' && this.setState({ clusterData: JSON.parse(res.data).cluster_nodes }))
                        }}
                    />
                </div>
                <div className={style.table}>
                    <div>
                        <Icon type='bar-chart' />
                        <span>社区信息</span>
                    </div>
                    <Table dataSource={state.clusterData} bordered pagination={false} scroll={{ y: 480 }}
                        title={() => (
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic title="社区ID" value={state.node.id} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="元素数量" value={state.node.num} />
                                </Col>
                            </Row>)}>
                        <Column width='25%' title="词汇" dataIndex="key" key="key" render={(text, record) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>} />
                        <Column width='30%' title="Z-value" dataIndex="z_value" key="z_value" render={(text, record) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>} />
                        <Column width='30%' title="P-value" dataIndex="p_value" key="p_value" render={(text, record) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>} />
                        <Column title="词频" dataIndex="weight" key="weight" />
                    </Table>
                </div>
            </div>
        )
    }
}
