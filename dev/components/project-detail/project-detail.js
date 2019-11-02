import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'

import { Tabs, Table, Divider, Tag, Button, Tooltip, Icon, Modal, Form, Input, Upload, Select, Spin, message } from 'antd'
const { TabPane } = Tabs, { Column, ColumnGroup } = Table, { Option } = Select

import { host } from '../../util'
import style from './project-detail.css'

let project_id

const DataForm = ({ form, handleSubmit, pid }) => {
    const { getFieldDecorator } = form
    return (
        <Form className={style.form}
            onSubmit={e => {
                e.preventDefault()
                form.validateFields((err, values) => {
                    if (!err)
                    {
                        const formData = new FormData()
                        formData.append('project_id', pid)
                        formData.append('dataset_name', values.name)
                        formData.append('dataset_file', values.dataset[0].originFileObj)
                        formData.append('stopword_flag', values.stopword ? 1 : 0)
                        formData.append('stopword_file', values.stopword ? values.stopword[0].originFileObj : null)
                        $.post({
                            url: host + '/dataset/upload',
                            processData: false,
                            contentType: false,
                            data: formData,
                            success: res => {
                                if (res.resultDesc === 'Success')
                                {
                                    message.success({ content: `创建 ${values.name} 成功.`, key: 'loadDataset' })
                                    handleSubmit('update')
                                }
                            }
                        }).fail(e => {
                            message.warning({ content: `创建 ${values.name} 时发生了错误!`, key: 'loadDataset' })
                            handleSubmit('update')
                        })
                        message.loading({ content: '创建中...', key: 'loadDataset', duration: 999 })
                        handleSubmit('exit')
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
            <div style={{
                position: 'absolute',
                bottom: '0',
                right: '0'
            }}>
                <a href={host + '/数据集模板.xlsx'}
                    download='数据集模板.xlsx'>数据集模板</a>
            </div>
        </Form>
    )
}
const WrappedDataForm = Form.create()(DataForm)
const ModelForm = ({ form, datasets, handleSubmit, pid }) => {
    const { getFieldDecorator } = form
    const [isCmNum, setIsCmNum] = useState(false)
    return (
        <Form className={style.form}
            onSubmit={e => {
                e.preventDefault()
                form.validateFields((err, values) => {
                    if (!err)
                    {
                        let data = {
                            project_id: pid,
                            ...values
                        }
                        for (let attr in data)
                        {
                            data['model.' + attr] = data[attr]
                            delete data[attr]
                        }
                        $.post(host + '/model/createModel', data, res => {
                            if (res.resultDesc === 'Success')
                            {
                                message.success({ content: `创建 ${values.model_name} 成功.`, key: 'loadModel' })
                                handleSubmit('update')
                            }
                        }).fail(e => {
                            message.warning({ content: `创建 ${values.model_name} 时发生了错误!`, key: 'loadModel' })
                            handleSubmit('update')
                        })
                        message.loading({ content: '创建中...', key: 'loadModel', duration: 5 }) // todo
                        handleSubmit('exit')
                    }
                })
            }}
        >
            <Form.Item label={
                <span>
                    模型名称&nbsp;
                    <Tooltip title="代表模型的唯一标志。">
                        <Icon type="question-circle-o" />
                    </Tooltip>
                </span>
            }>
                {getFieldDecorator('model_name', {
                    rules: [{ required: true, message: 'Please input model name' }],
                })(
                    <Input placeholder="Model Name" />,
                )}
            </Form.Item>
            <Form.Item label={
                <span>
                    选择数据集&nbsp;
                    <Tooltip title="可选择数据中心中已上传数据，一个模型只能对应于一个数据集，而一个数据集可以属于多个模型。">
                        <Icon type="question-circle-o" />
                    </Tooltip>
                </span>
            }>
                {getFieldDecorator('dataset_id', {
                    // initialValue: datasets.length ? '0' : '',
                    rules: [{ required: true, message: 'Should select an dataset' }],
                    getValueFromEvent: e => e
                })(
                    <Select
                        showSearch
                        placeholder="Select a Dataset"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {datasets.map((v, i) => <Option value={v.datasetId} key={i}>{`${v.datasetId}. ${v.datasetName}`}</Option>)}
                    </Select>
                )}
            </Form.Item>
            <Form.Item label={
                <span>
                    社区分区算法&nbsp;
                    <Tooltip title='选用社区划分算法对各时段的共词网络进行社区发现， 得到共词网络的社区结构。主要有3种算法，非重叠社区：Blondel分区算法和Newman MM算法（基于模块度的贪心算法）；重叠社区：Ball Overlapping算法。'>
                        <Icon type="question-circle-o" />
                    </Tooltip>
                </span>
            } >
                {getFieldDecorator('detector_flag', {
                    initialValue: '0'
                })(
                    <Select onChange={e => setIsCmNum(e === '2')}>
                        <Option value="0"> Blondel</Option>
                        <Option value="1"> Newman MM</Option>
                        <Option value="2"> Ball OverLapping</Option>
                    </Select>
                )}
            </Form.Item>
            {isCmNum ?
                <Form.Item label={
                    <span>
                        社区数量
                    </span>
                }>
                    {getFieldDecorator('community_num', {
                        rules: [{ required: true }],
                        initialValue: '1'
                    })(
                        <Input />,
                    )}
                </Form.Item> : null}
            <Form.Item label={
                <span>
                    社区排序方法&nbsp;
                    <Tooltip title='对学科主题进行排序。有两种排序方法：一是根据学科主题的词汇规模或者文档规模，即节点数量；二是将社区看做节点，计算社区在网络中的度值，根据社区的度值进行排序。'>
                        <Icon type="question-circle-o" />
                    </Tooltip>
                </span>
            }>
                {getFieldDecorator('sort_flag', {
                    initialValue: '0'
                })(
                    <Select>
                        <Option value="0"> 中心度</Option>
                        <Option value="1"> 节点数量</Option>
                    </Select>
                )}
            </Form.Item>
            <Form.Item label={
                <span>
                    社区相似度系数&nbsp;
                    <Tooltip title='在进行社区演化分析过程中，需要寻找社区前驱和后继，而其本质上是一个度量社区相似度的问题，因此提供5种相似度测量指标，即为节点比重后向寻找、节点比重前向寻找、余弦相似度、扩展Jaccard系数、核心节点相似度计算。'>
                        <Icon type="question-circle-o" />
                    </Tooltip>
                </span>
            }>
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
            <Form.Item label={
                <span>
                    阈值&nbsp;
                    <Tooltip title='计算社区相似度的阈值设定。'>
                        <Icon type="question-circle-o" />
                    </Tooltip>
                </span>
            }>
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

const Mapping = {
    detectorFlag: ['Blondel', 'Newman MM', 'Ball OverLapping'],
    sortFlag: ['中心度', '节点数量'],
    modelStatus: ['训练中', '成功', '失败']
}

export default class ProjectDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabOn: 'data',
            visible: false,
            datasets: [],
            models: [],
        }
        project_id = this.props.match.id
        this.update()
    }
    componentDidMount() {
        this.updateHandle = setInterval(() => this.handleSubmit('update'), 2000)
    }
    componentWillUnmount() {
        clearInterval(this.updateHandle)
    }

    update() {
        $.post(host + '/dataset/getDatasetList', {
            project_id: this.props.match.params.id,
            page_num: 1,
            page_size: 100
        }, res => {
            if (res.resultDesc === 'Success')
            {
                this.setState({ datasets: res.data.list })
            }
        })
        $.post(host + '/model/getModelList', {
            project_id: this.props.match.params.id,
            page_num: 1,
            page_size: 100
        }, res => {
            if (res.resultDesc === 'Success')
            {
                this.setState({ models: res.data.list })
            }
        })
    }

    handleSubmit(mode) {
        /*
        if (this.state.tabOn === 'data') {
            this.state.datasets.unshift(values)
            this.setState({ datasets: this.state.datasets })
        } else if (this.state.tabOn === 'data') {
            this.state.models, unshift(values)
            this.setState({ models: this.state.models })
        }*/
        mode === 'update' && this.update()
        mode === 'exit' && this.setState({ visible: false })
    }

    render() {
        const { state, props } = this
        return (
            <div className={style.main}>
                <Button onClick={e => this.setState({ visible: true })} type="primary" shape="round" icon="plus">
                    添加{state.tabOn === 'data' ? '数据集' : '模型'}
                </Button>
                <Modal
                    title={`创建${state.tabOn === 'data' ? '数据集' : '模型'}`}
                    footer={null}
                    visible={this.state.visible} destroyOnClose
                    onCancel={e => this.setState({ visible: false })}
                >
                    <Spin spinning={false}>
                        {state.tabOn === 'data' ?
                            <WrappedDataForm handleSubmit={this.handleSubmit.bind(this)} pid={props.match.params.id} /> :
                            <WrappedModelForm datasets={state.datasets} handleSubmit={this.handleSubmit.bind(this)} pid={props.match.params.id} />}
                    </Spin>
                </Modal>
                <Tabs className={style.tabs} defaultActiveKey={state.tabOn} tabPosition='left' onChange={
                    key => this.setState({ tabOn: key })
                }>
                    <TabPane tab="数据中心" key="data">
                        < Table dataSource={state.datasets} >
                            {/*<Column title="ID" dataIndex="datasetId" key="id" />*/}
                            <Column title="数据集名称" dataIndex="datasetName" key="name" />
                            <Column title="周期数目" dataIndex="periodNum" key="pnum" />
                            <Column title="数据条数" dataIndex="datasetNum" key="dnum" />
                            <Column title="上传时间" dataIndex="createTime" key="time"
                                render={(text, record) => (
                                    <span>{new Date(text).toLocaleString()}</span>
                                )} />
                            <Column title="操作" key="action"
                                render={(text, record) => (
                                    <span>
                                        <a href={`${host}/dataset/downloadDataset?dataset_id=${record.datasetId}`}
                                            download={`${record.datasetId}_${record.datasetName}`}
                                        >下载</a>
                                        <Divider type="vertical" />
                                        <a onClick={
                                            e => $.post(host + '/dataset/deleteDataset', {
                                                dataset_id: record.datasetId
                                            }, res => {
                                                // todo
                                                if (res.resultCode === '1000')
                                                {
                                                    this.update()
                                                }
                                            })
                                        }>删除</a>
                                    </span>
                                )} />
                        </ Table>
                    </TabPane>
                    <TabPane tab="模型中心" key="model">
                        < Table dataSource={state.models} >
                            {/*<Column title="ID" dataIndex="modelId" key="id" />*/}
                            <Column title="模型名称" dataIndex="modelName" key="name" />
                            <Column title="状态" dataIndex="modelStatus" key="status"
                                render={text => (
                                    <Tag color={['geekblue', 'green', 'volcano'][text]} key={text}>
                                        {Mapping.modelStatus[text]}
                                    </Tag>
                                )} />
                            <Column title="社区选择" dataIndex="detectorFlag" key=""
                                render={text => Mapping.detectorFlag[text]} />
                            <Column title="相似度系数" dataIndex="similarityThreshold" key="similarT" />
                            <Column title="社区排序" dataIndex="sortFlag" key=""
                                render={text => Mapping.sortFlag[text]} />
                            <Column title="更新时间" dataIndex="modifyTime" key="time"
                                render={(text, record) => new Date(text).toLocaleString()} />
                            <Column title="操作" key="action"
                                render={(text, record) => (
                                    <span>
                                        <Link to={`/model/${record.modelId}`}>查看</Link>
                                        <Divider type="vertical" />
                                        <a onClick={
                                            e => $.post(host + '/model/deleteModel', {
                                                model_id: record.modelId
                                            }, res => {
                                                // todo
                                                if (res.resultCode === '1000')
                                                {
                                                    this.update()
                                                }
                                            })
                                        }>删除</a>
                                    </span>
                                )} />
                        </ Table>
                    </TabPane>
                </Tabs>
            </div >
        )
    }
}

