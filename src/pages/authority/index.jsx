import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import moment from 'moment';
import { admin, removeAdmin, addAdmin } from './service';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await addAdmin({ ...fields });
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
  // const hide = message.loading('正在保存');
  // try {
  //   await updateCluster(fields);
  //   hide();
  //   message.success('保存成功');
  //   return true;
  // } catch (error) {
  //   hide();
  //   message.error('保存失败请重试！');
  //   return false;
  // }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (data) => {
  const hide = message.loading('正在删除');

  try {
    await removeAdmin(data);
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
  /** 窗口的弹窗 */
  const [modalVisible, handleModalVisible] = useState(false);
  /** 分布更新窗口的弹窗 */
  const actionRef = useRef();
  /** form initial Value */
  const [formValues, handleFormValues] = useState({});

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
        title: '描述',
        dataIndex: 'description',
    },
    {
        title: '创建者',
        dataIndex: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'ct',
      render: (v) => v ? moment.unix(v).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          key="delete"
          onConfirm={async () => {
            await handleRemove(record.id);
            actionRef.current?.reloadAndRest();
          }}
          title={`确定 ${record.username} 删除么？`}
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
            <PlusOutlined /> 添加管理员
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize } = params;
          const pagination = {
            limit: pageSize,
            offset: (current - 1) * pageSize
          };
          const result = await admin(pagination);
          return {
            total: result.total,
            data: result.items,
            success: true,
          }
        }}
        columns={columns}
      />
      <ModalForm
        title={"添加管理员"}
        width="400px"
        modalProps={{destroyOnClose: true}}
        visible={modalVisible}
        onVisibleChange={handleModalVisible}
        formRef={formRef}
        initialValues={formValues}
        onFinish={async (value) => {
          const success = await handleAdd(value);
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
              message: '用户名为必填项',
            },
          ]}
          width="md"
          label="用户名"
          name="username"
        />
        <ProFormText
          rules={[
            {
              message: '描述为必填项',
            },
          ]}
          width="md"
          label="描述"
          name="description"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
