import NumberRange from '@/components/InputFilter/NumberRange';
import { PlusOutlined } from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, DatePicker, Divider, Drawer, Select } from 'antd';
import React, { useState, useRef } from 'react';
import { Link, useRouteMatch } from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { ModelListItem } from './data';
import { queryModelList, deleteModel } from './service';

const TableList: React.FC<{}> = (props) => {
  const match = useRouteMatch<{ pid: string }>();

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [stepFormValues, setStepFormValues] = useState({});

  const actionRef = useRef<ActionType>();

  const [row, setRow] = useState<ModelListItem>();
  const [selectedRowsState, setSelectedRows] = useState<ModelListItem[]>([]);

  const columns: ProColumns<ModelListItem>[] = [
    {
      title: '模型名称',
      dataIndex: 'modelName',
      fieldProps: {
        rules: [
          {
            required: true,
            message: '规则名称为必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '社区选择',
      dataIndex: 'detectorFlag',
      valueEnum: {
        0: { text: 'Blondel' },
        1: { text: 'Newman' },
        2: { text: 'MM' },
        3: { text: 'Ball OverLapping' },
      },
    },
    {
      title: '社区排序',
      dataIndex: 'sortFlag',
      valueEnum: {
        0: { text: '中心度' },
        1: { text: '节点数量' },
      },
    },
    {
      title: '相似度系数',
      dataIndex: 'similarityThreshold',
      sorter: true,
      renderFormItem(item, { value, onChange, onSelect }) {
        return <NumberRange />;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'modifyTime',
      sorter: true,
      hideInForm: true,
      valueType: 'dateTime',
      renderFormItem(item, { value, onChange, onSelect }) {
        return <DatePicker.RangePicker />
      }
    },
    {
      title: '状态',
      dataIndex: 'modelStatus',
      hideInForm: true,
      valueEnum: {
        0: { text: '训练中', status: 'Processing' },
        1: { text: '成功', status: 'Success' },
        2: { text: '失败', status: 'Erros' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Link to={`/model/dashboardmonitor/${record.modelId}`}>查看</Link>
          <Divider type="vertical" />
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
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<ModelListItem>
        headerTitle="模型列表"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const res = await queryModelList({ project_id: match.params.pid, ...params });
          return { data: res.data.list, success: true, total: res.data.totalRow };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
              {/* <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span> */}
            </div>
          }
        >
          <Button
            onClick={async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          {/* <Button type="primary">批量审批</Button> */}
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<ModelListItem, ModelListItem>
          onSubmit={async (value) => {
            // const success = await handleAdd(value);
            // if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
            // }
          }}
          rowKey="key"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {/* {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null} */}

      {/* <Drawer
        width={600}
        visible={!!row} 
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.datasetId && (
          <ProDescriptions<ModelListItem>
            column={2}
            title={row?.datasetId}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.datasetId,
            }}
            columns={columns}
          />
        )}
      </Drawer> */}
    </PageContainer>
  );
};

export default TableList;
