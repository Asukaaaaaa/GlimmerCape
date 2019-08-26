import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { Tabs, Table, Divider, Tag } from 'antd'
const { TabPane } = Tabs, { Column, ColumnGroup } = Table

import style from './project-detail.css'

const data = new Array(5).fill(0)

export default class ProjectDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tabOn: 'data'
        }
    }

    render() {
        const { state } = this
        return (
            <div className={style.main}>
                <Tabs className={style.tabs} defaultActiveKey="1" tabPosition='left'>
                    <TabPane tab="数据中心" key="1">
                        < Table dataSource={data} >
                            <ColumnGroup title="数据集">
                                <Column title="ID" dataIndex="id" key="id" />
                                <Column title="名称" dataIndex="name" key="name" />
                            </ColumnGroup>
                            <Column title="周期数目" dataIndex="perNum" key="perNum" />
                            <Column title="数据条数" dataIndex="dataNum" key="dataNum" />
                            <Column title="上传时间" dataIndex="time" key="time" />
                            <Column title="Action" key="action"
                                render={(text, record) => (
                                    <span>
                                        <Link to={`/dataset/${0}`}>查看</Link>
                                        <Divider type="vertical" />
                                        <a>删除</a>
                                    </span>
                                )} />
                        </ Table>
                    </TabPane>
                    <TabPane tab="模型中心" key="2">
                        < Table dataSource={data} >
                            <ColumnGroup title="模型">
                                <Column title="ID" dataIndex="id" key="id" />
                                <Column title="名称" dataIndex="name" key="name" />
                                <Column title="状态" dataIndex="name" key="name" />
                            </ColumnGroup>
                            <Column title="社区选择" dataIndex="perNum" key="perNum" />
                            <Column title="相似度系数" dataIndex="dataNum" key="dataNum" />
                            <Column title="社区排序" dataIndex="time" key="time" />
                            <Column title="更新时间" dataIndex="time" key="time" />
                            <Column title="Action" key="action"
                                render={(text, record) => (
                                    <span>
                                        <Link to={`/model/${0}`}>查看</Link>
                                        <Divider type="vertical" />
                                        <a>删除</a>
                                    </span>
                                )} />
                        </ Table>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

