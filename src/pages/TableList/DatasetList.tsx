import NumberRange from '@/components/InputFilter/NumberRange';
import { PlusOutlined } from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, DatePicker, Divider, Drawer, Input, InputNumber } from 'antd';
import React, { useState, useRef } from 'react';
import { useRouteMatch } from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { DatasetListItem } from './data';
import { deleteDataset, queryDatesetList } from './service';
import './index.less'

const TableList: React.FC<{}> = (props) => {
  const match = useRouteMatch<{ pid: string }>();

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [stepFormValues, setStepFormValues] = useState({});

  const actionRef = useRef<ActionType>();

  const [row, setRow] = useState<DatasetListItem>();
  const [selectedRowsState, setSelectedRows] = useState<DatasetListItem[]>([]);

  const columns: ProColumns<DatasetListItem>[] = [
    {
      title: '数据集名称',
      dataIndex: 'datasetName',
      // tip: '规则名称是唯一的 key',
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
      title: '周期数目',
      dataIndex: 'periodNum',
      sorter: true,
      valueType: 'digit',
      renderFormItem(item, { value, onChange, onSelect }) {
        return <NumberRange />;
      },
    },
    {
      title: '数据条数',
      dataIndex: 'datasetNum',
      sorter: true,
      valueType: 'digit',
      renderFormItem(item, { value, onChange, onSelect }) {
        return <NumberRange />;
      },
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      sorter: true,
      hideInForm: true,
      valueType: 'dateTime',
      renderFormItem() {
        return (
          <DatePicker.RangePicker
            // style={{ width: '420px' }}
            // showTime={{ format: 'HH:mm' }}
            // format="YYYY-MM-DD HH:mm"
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            下载
          </a>
          <Divider type="vertical" />
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
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<DatasetListItem>
        headerTitle="数据集列表"
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
          const res = await queryDatesetList({ project_id: match.params.pid, ...params });
          return { data: res.data.list, success: true, total: res.data.totalRow };
        }}
        defaultData={[]}
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
        <ProTable<DatasetListItem, DatasetListItem>
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
          <ProDescriptions<DatasetListItem>
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
