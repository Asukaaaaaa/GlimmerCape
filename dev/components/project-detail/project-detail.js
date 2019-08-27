import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { Tabs, Table, Divider, Tag, Button, Icon, Modal, Form, Input, Upload, Select } from 'antd'
const { TabPane } = Tabs, { Column, ColumnGroup } = Table, { Option } = Select

import { host } from '../../util'
import style from './project-detail.css'

let project_id

const DataForm = ({ form, handleSubmit }) => {
    const { getFieldDecorator } = form
    return (
        <Form className={style.form}
            onSubmit={e => {
                e.preventDefault()
                form.validateFields((err, values) => {
                    if (!err) {
                        const formData = new FormData()
                        formData.append('project_id')
                        formData.append('dataset_name', values.name)
                        formData.append('dataset_file', values.dataset[0])
                        formData.append('stopword_flag', values.stopword ? 1 : 0)
                        formData.append('stopword_file', values.stopword ? values.stopword[0] : null)
                        fetch(host + '/dataset/upload', {
                            method: 'POST',
                            body: formData
                        }).then(r => r.json()).then(res => {
                            if (res.resultDesc === 'Success') {
                                handleSubmit()
                            }
                        })
                    }
                })
            }}
        >
            <Form.Item>
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please input dataset name!' }],
                })(
                    <Input placeholder="Dataset Name" />,
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('dataset', {
                    rules: [{ required: true, message: '请选择数据集!' }],
                    valuePropName: 'fileList',
                    getValueFromEvent: e => e.fileList ? e.fileList : e,
                })(
                    <Upload
                        beforeUpload={() => false}>
                        <Button>
                            <Icon type="upload" /> 上传数据集
                        </Button>
                    </Upload>,
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('stopword', {
                    valuePropName: 'fileList',
                    getValueFromEvent: e => e.fileList ? e.fileList : e,
                })(
                    <Upload
                        beforeUpload={() => false}>
                        <Button>
                            <Icon type="upload" /> 上传停用词
                        </Button>
                    </Upload>,
                )}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className={style["form-button"]}>
                    Create
                </Button>
            </Form.Item>
        </Form>
    )
}
const WrappedDataForm = Form.create()(DataForm)
const ModelForm = ({ form, datasets }) => {
    const { getFieldDecorator, handleSubmit } = form
    return (
        <Form className={style.form}
            onSubmit={e => {
                e.preventDefault()
                form.validateFields((err, values) => {
                    if (!err) {
                        // TODO
                        fetch(host + '/model/createModel', {
                            method: 'POST',
                            body: JSON.stringify({
                                model: {
                                    project_id: 0,
                                    ...values
                                }
                            })
                        }).then(r => r.json()).then(res => {
                            if (res.resultDesc === 'Success') {
                                handleSubmit()
                            }
                        })
                    }
                })
            }}
        >
            <Form.Item label='模型名称'>
                {getFieldDecorator('model_name', {
                    rules: [{ required: true, message: 'Please input model name!' }],
                })(
                    <Input placeholder="Model Name" />,
                )}
            </Form.Item>
            <Form.Item label='选择数据集'>
                {getFieldDecorator('dataset_id', {
                    initialValue: '0'
                })(
                    <Select
                        showSearch
                        placeholder="Select a Dataset"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {datasets.map((v, i) => <Option value={i} key={i}>{v.datasetName}</Option>)}
                    </Select>
                )}
            </Form.Item>
            <Form.Item label='社区数量'>
                {getFieldDecorator('community_num', {
                    rules: [{ required: true }],
                    initialValue: '1'
                })(
                    <Input />,
                )}
            </Form.Item>
            <Form.Item label="社区分区算法" >
                {getFieldDecorator('detector_flag', {
                    initialValue: '0'
                })(
                    <Select>
                        <Option value="0"> Blondel</Option>
                        <Option value="1"> Newman MM</Option>
                        <Option value="2"> Ball OverLapping</Option>
                    </Select>
                )}
            </Form.Item>
            <Form.Item label="社区排序方法" >
                {getFieldDecorator('sort_flag', {
                    initialValue: '0'
                })(
                    <Select>
                        <Option value="0"> 中心度</Option>
                        <Option value="1"> 节点数量</Option>
                    </Select>
                )}
            </Form.Item>
            <Form.Item label="社区相似度系数" >
                {getFieldDecorator('similarity_flag', {
                    initialValue: '0'
                })(
                    <Select>
                        <Option value="0"> 节点比重后向寻找</Option>
                        <Option value="1"> 节点比重前向寻找</Option>
                        <Option value="2"> 余弦相似度</Option>
                        <Option value="3"> 扩展Jaccard系数</Option>
                        <Option value="4"> 核心节点相似度</Option>
                    </Select>
                )}
            </Form.Item>
            <Form.Item label='阈值'>
                {getFieldDecorator('similarity_threshold', {
                    rules: [{ required: true, message: 'Please input model name!' }],
                    initialValue: '0.3'
                })(
                    <Input />,
                )}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className={style["form-button"]}>
                    Create
                </Button>
            </Form.Item>
        </Form>
    )
}
const WrappedModelForm = Form.create()(ModelForm)

export default class ProjectDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabOn: 'data',
            visible: false,
            datasets: [{}],
            models: [{}],
        }
        project_id = this.props.match.id
        this.update()
    }

    update() {
        fetch(host + '/dataset/getDatasetList', {
            method: 'POST',
            body: JSON.stringify({
                project_id: 0,
                page_num: 1,
                page_size: 100
            })
        }).then(r => r.json()).then(res => {
            if (res.resultDesc === 'Success') {
                this.setState({ datasets: res.list })
            }
        })
        fetch(host + '/model/getModelList', {
            method: 'POST',
            body: JSON.stringify({
                project_id: 0,
                page_num: 1,
                page_size: 100
            })
        }).then(r => r.json()).then(res => {
            if (res.resultDesc === 'Success') {
                this.setState({ models: res.list })
            }
        })
    }

    render() {
        const { state } = this
        return (
            <div className={style.main}>
                <Button onClick={e => this.setState({ visible: true })} type="primary" shape="round" icon="plus">
                    添加{state.tabOn === 'data' ? '数据集' : '模型'}
                </Button>
                <Modal
                    title="创建项目"
                    footer={null}
                    visible={this.state.visible} destroyOnClose
                    onCancel={e => this.setState({ visible: false })}
                >
                    {state.tabOn === 'data' ?
                        <WrappedDataForm handleSubmit={null} /> :
                        <WrappedModelForm datasets={state.datasets} handleSubmit={null} />}
                </Modal>
                <Tabs className={style.tabs} defaultActiveKey={state.tabOn} tabPosition='left' onChange={
                    key => this.setState({ tabOn: key })
                }>
                    <TabPane tab="数据中心" key="data">
                        < Table dataSource={state.datasets} >
                            <ColumnGroup title="数据集">
                                <Column title="ID" dataIndex="datasetId" key="id" />
                                <Column title="名称" dataIndex="datasetName" key="name" />
                            </ColumnGroup>
                            <Column title="周期数目" dataIndex="periodNum" key="pnum" />
                            <Column title="数据条数" dataIndex="datasetNum" key="dnum" />
                            <Column title="上传时间" dataIndex="createTime" key="time" />
                            <Column title="Action" key="action"
                                render={(text, record) => (
                                    <span>
                                        <Link to={`/dataset/${record.datasetId}`}>查看</Link>
                                        <Divider type="vertical" />
                                        <a>删除</a>
                                    </span>
                                )} />
                        </ Table>
                    </TabPane>
                    <TabPane tab="模型中心" key="model">
                        < Table dataSource={state.models} >
                            <ColumnGroup title="模型">
                                <Column title="ID" dataIndex="modelId" key="id" />
                                <Column title="名称" dataIndex="modelName" key="name" />
                                <Column title="状态" dataIndex="modelStatus" key="status" />
                            </ColumnGroup>
                            <Column title="社区选择" dataIndex="" key="" />
                            <Column title="相似度系数" dataIndex="similarityThreshold" key="similarT" />
                            <Column title="社区排序" dataIndex="" key="" />
                            <Column title="更新时间" dataIndex="modifyTime" key="time" />
                            <Column title="Action" key="action"
                                render={(text, record) => (
                                    <span>
                                        <Link to={`/model/${record.modelId}`}>查看</Link>
                                        <Divider type="vertical" />
                                        <a>删除</a>
                                    </span>
                                )} />
                        </ Table>
                    </TabPane>
                </Tabs>
            </div >
        )
    }
}

