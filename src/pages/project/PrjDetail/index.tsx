import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin, Tabs, Table, Space } from 'antd';
import styles from './index.less';
import { history } from 'umi';

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

  // tab 与路由绑定
  const [tab, setTab] = useState('dataset');
  useEffect(() => {
    setTab(props.match.params.tab);
  }, [props.match.params.tab]);

  // init
  useEffect(() => {
    // effect;
    return () => {
      // cleanup;
    };
  }, []);

  return (
    <PageContainer className={styles.main}>
      <Tabs
        activeKey={tab}
        onChange={(key) => history.push(`/project/detail/${key}`)}
        size="large"
        animated
      >
        <Tabs.TabPane tab="数据中心" key="dataset">
          <Table
            columns={colums.dataset}
            pagination={{}}
            onChange={(pagination, filters, sorter, { currentDataSource, action }) => {
              props.dispatch({
                type: `projectDetail/${action}`,
                payload: {},
              });
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="模型中心" key="model">
          <Table
            columns={colums.model}
            pagination={{}}
            onChange={(pagination, filters, sorter, { currentDataSource, action }) => {
              props.dispatch({
                type: `projectDetail/${action}`,
                payload: {},
              });
            }}
          />
        </Tabs.TabPane>
      </Tabs>
    </PageContainer>
  );
};
