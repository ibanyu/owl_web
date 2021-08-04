import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import moment from 'moment';
import { addCluster, updateCluster, removeCluster, cluster } from './service';

const ACTION_ENUM = {
  EDIT: 'EDIT',
  CREATE: 'CREATE',
}
/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await addCluster({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('正在保存');
  try {
    await updateCluster(fields);
    hide();
    message.success('保存成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (data) => {
  const hide = message.loading('正在删除');

  try {
    await removeCluster(data);
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList = () => {
  const formRef = useRef();
  /** 标记操作行为 默认创建 */
  const [action, handleAction] = useState(ACTION_ENUM.CREATE);
  /** 窗口的弹窗 */
  const [modalVisible, handleModalVisible] = useState(false);
  /** 分布更新窗口的弹窗 */
  const actionRef = useRef();
  /** 添加集群 */
  const IS_CREATING = action === ACTION_ENUM.CREATE;
  /** form initial Value */
  const [formValues, handleFormValues] = useState({});

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '集群名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: '地址',
      dataIndex: 'addr',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'user',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'ct',
      render: (v) => v ? moment.unix(v).format('YYYY-MM-DD HH:mm:ss') : '-',
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'ut',
      render: (v) => v ? moment.unix(v).format('YYYY-MM-DD HH:mm:ss') : '-',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => [
        <Tooltip
          key="edit"
          title="编辑"
        >
          <EditOutlined
            onClick={() => {
              handleAction(ACTION_ENUM.EDIT);
              handleFormValues(record);
              handleModalVisible(true);
            }}
            style={{ color: '#1890ff' }}/>
        </Tooltip>,
        <Popconfirm
          key="delete"
          onConfirm={async () => {
            await handleRemove(record);
            actionRef.current?.reloadAndRest();
          }}
          title="确定删除么？"
          icon={
            <QuestionCircleOutlined style={{ color: 'red' }} />
          }
        >
          <Tooltip title="删除">
           <DeleteOutlined style={{ color: 'red' }}/>
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        search={false}
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleFormValues({});
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 添加集群
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize } = params;
          const pagination = {
            limit: pageSize,
            offset: (current - 1) * pageSize
          };
          const result = await cluster(pagination);
          return {
            total: result.total,
            data: result.items,
            success: true,
          }
        }}
        columns={columns}
      />
      <ModalForm
        title={IS_CREATING ? "添加集群" : '编辑集群'}
        width="400px"
        modalProps={{destroyOnClose: true}}
        visible={modalVisible}
        onVisibleChange={handleModalVisible}
        formRef={formRef}
        initialValues={formValues}
        onFinish={async (value) => {
          const success = await (IS_CREATING ? handleAdd(value) : handleUpdate({id: formValues.id, ...value}));
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '集群名称为必填项',
            },
          ]}
          width="md"
          label="集群名称"
          name="name"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '描述为必填项',
            },
          ]}
          width="md"
          label="描述"
          name="description"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '地址为必填项',
            },
          ]}
          width="md"
          label="地址"
          name="addr"
          placeholder="请输入ip:port"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '用户名为必填项',
            },
          ]}
          width="md"
          label="用户名"
          name="user"
        />
        <ProFormText.Password
          rules={[
            {
              required: true,
              message: '密码为必填项',
            },
          ]}
          fieldProps={{visibilityToggle: false}}
          width="md"
          label="密码"
          name="pwd"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
