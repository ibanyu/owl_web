import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined, EditOutlined } from '@ant-design/icons';
import { message, Popconfirm, Switch } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { rules, updateRules } from './service';
/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields) => {
  const hide = message.loading('正在保存');
  try {
    await updateRules(fields);
    hide();
    message.success('保存成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存失败请重试！');
    return false;
  }
};

const TableList = () => {
  /** 分布更新窗口的弹窗 */
  const actionRef = useRef();
  /** form initial Value */

  const columns = [
    {
      title: '规则名',
      dataIndex: 'Name',
    },
    {
      title: '规则内容',
      dataIndex: 'Summary',
    },
    {
      title: '操作',
      dataIndex: 'close',
      render: (check, record) => {
        return <Switch
          checked={!check}
          onChange={async (v) => {
            const success = await handleUpdate({ name: record.Name, action: (check ? 'open' : 'close'),});
            if(success){
              actionRef.current?.reloadAndRest();
            }
          }}
          checkedChildren="开"
          unCheckedChildren="关"
        />
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        search={false}
        options={false}
        request={async (params) => {
          const { current, pageSize } = params;
          const pagination = {
            limit: pageSize,
            offset: (current - 1) * pageSize
          };
          const result = await rules(pagination);
          return {
            total: result.total,
            data: result.items,
            success: true,
          }
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
