import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect, useCallback, FC } from 'react';
import { Spin, Tabs, Table, Space, Tag, Button } from 'antd';
import styles from './index.less';
import { connect, history, Link, useDispatch, useRouteMatch } from 'umi';
import { StateType, DatasetItem, ModelItem } from './model';
import Downloader from '@/components/Downloader';
import { downloadDataset, deleteDataset, deleteModel } from './service';
import { originFilePathParser } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';

type PropsType = {
  projectDetail: StateType;
};
export const Detail: FC<PropsType> = (props) => {
  const colums = {
    dataset: [
      {
        title: '数据集名称',
        dataIndex: 'datasetName',
        key: 'datasetName',
      },
      {
        title: '周期数目',
        dataIndex: 'periodNum',
        key: 'periodNum',
      },
      {
        title: '数据条数',
        dataIndex: 'datasetNum',
        key: 'datasetNum',
      },
      {
        title: '上传时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render(time: number) {
          return <span>{new Date(time).toLocaleString()}</span>;
        },
      },
      {
        title: '操作',
        key: 'action',
        render(record: DatasetItem) {
          return (
            <Space>
              <a
                onClick={(e) => {
                  // downloadDataset({ dataset_id: '' + record.datasetId });
                  Downloader.get(originFilePathParser(record.datasetUrl));
                }}
              >
                下载
              </a>
              <a
                onClick={(e) => {
                  deleteDataset({ dataset_id: '' + record.datasetId })
                    .then((res) => {
                      // TODO
                    })
                    .catch((err) => console.warn(err));
                }}
              >
                删除
              </a>
            </Space>
          );
        },
      },
    ],
    model: [
      {
        title: '模型名称',
        dataIndex: 'modelName',
        key: 'modelName',
      },
      {
        title: '状态',
        dataIndex: 'modelStatus',
        key: 'modelStatus',
        render(text: string) {
          return (
            <Tag color={['geekblue', 'green', 'volcano'][text]} key={text}>
              {['训练中', '成功', '失败'][text]}
            </Tag>
          );
        },
      },
      {
        title: '社区选择',
        dataIndex: 'detectorFlag',
        key: 'detectorFlag',
        render(text: string) {
          return <span>{['Blondel', 'Newman MM', 'Ball OverLapping'][text]}</span>;
        },
      },
      {
        title: '相似度系数',
        dataIndex: 'similarityThreshold',
        key: 'similarityThreshold',
      },
      {
        title: '社区排序',
        dataIndex: 'sortFlag',
        key: 'sortFlag',
        render(text: string) {
          return <span>{['中心度', '节点数量'][text]}</span>;
        },
      },
      {
        title: '更新时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        render(time: number) {
          return <span>{new Date(time).toLocaleString()}</span>;
        },
      },
      {
        title: '操作',
        key: 'action',
        render(record: ModelItem) {
          return (
            <Space>
              <Link to={`/project/model/${record.modelId}`}>查看</Link>
              <a
                onClick={(e) => {
                  deleteModel({ model_id: '' + record.modelId })
                    .then((res) => {
                      // TODO
                    })
                    .catch((err) => console.warn(err));
                }}
              >
                删除
              </a>
            </Space>
          );
        },
      },
    ],
  };

  const dispatch = useDispatch();

  // tab 与路由绑定
  const match = useRouteMatch<{ tab: string; pid: string }>();
  const [tab, setTab] = useState('dataset');
  const [pid, setPid] = useState('');
  useEffect(() => {
    const { tab, pid } = match.params;
    dispatch({
      type: `projectDetail/fetch${tab.replace(/^[a-z]/g, (L) => L.toUpperCase())}`,
      payload: pid,
    });
    setTab(tab);
    setPid(pid);
  }, [match.params]);
  useEffect(() => {
    // console.log(1);
    return () => {
      dispatch({
        type: 'projectDetail/clear',
      });
    };
  }, []);

  const {
    datasetView,
    datasetPage,
    datasetViewLoading,
    modelView,
    modelPage,
    modelViewLoading,
  } = props.projectDetail;
  return (
    <PageContainer>
      <Tabs
        activeKey={tab}
        onChange={(key) => history.push(`/project/detail/${key}/${pid}`)}
        size="large"
        animated
      >
        <Tabs.TabPane tab="数据中心" key="dataset">
          <header
            style={{
              height: '64px',
              padding: '0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <strong>
              <big>数据集列表</big>
            </strong>
            <div>
              <Button type="primary" icon={<PlusOutlined />}>
                新建
              </Button>
            </div>
          </header>
          <Table
            columns={colums.dataset}
            dataSource={datasetView?.slice((datasetPage - 1) * 20, datasetPage * 20)}
            loading={datasetViewLoading}
            pagination={{}}
            onChange={(pagination, filters, sorter, { currentDataSource, action }) => {
              dispatch({
                type: `projectDetail/${action}`,
                payload: {
                  type: tab,
                  paginate: pagination,
                  filter: filters,
                  sort: sorter,
                }[action],
              });
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="模型中心" key="model">
          <Table
            columns={colums.model}
            dataSource={modelView?.slice((modelPage - 1) * 20, modelPage * 20)}
            loading={modelViewLoading}
            pagination={{}}
            onChange={(pagination, filters, sorter, { currentDataSource, action }) => {
              dispatch({
                type: `projectDetail/${action}`,
                payload: {
                  type: tab,
                  pagination,
                  filters,
                  sorter,
                },
              });
            }}
          />
        </Tabs.TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default connect(({ projectDetail }: { projectDetail: StateType }) => ({ projectDetail }))(
  Detail,
);
