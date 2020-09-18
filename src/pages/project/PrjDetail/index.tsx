import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect, useCallback } from 'react';
import { Spin, Tabs, Table, Space } from 'antd';
import styles from './index.less';
import { history, useDispatch, useRouteMatch } from 'umi';
import { pickBy } from 'lodash';

export default (props) => {
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
      },
      {
        title: '操作',
        key: 'action',
        render() {
          return (
            <Space>
              <a>下载</a>
              <a>删除</a>
            </Space>
          );
        },
      },
    ],
    model: [
      {
        title: '模型名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '状态',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '社区选择',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '相似度系数',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '社区排序',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '更新时间',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        key: 'action',
        render() {
          return (
            <Space>
              <a>查看</a>
              <a>删除</a>
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
    setTab(tab);
    setPid(pid);
  }, [match.params]);
  useEffect(() => {
    // 拉取初始数据
    dispatch({
      type: `projectDetail/fetch${match.params.tab.replace(/^[a-z]/g, (L) => L.toUpperCase())}`,
      payload: {
        project_id: pid,
        page_num: 1,
      },
    });
    // return () => {};
  }, []);

  return (
    <PageContainer className={styles.main}>
      <Tabs
        activeKey={tab}
        onChange={(key) => history.push(`/project/detail/${key}/${pid}`)}
        size="large"
        animated
      >
        <Tabs.TabPane tab="数据中心" key="dataset">
          <Table
            columns={colums.dataset}
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
