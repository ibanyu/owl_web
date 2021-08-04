import React, { useState, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Badge } from 'antd';
import moment from 'moment';

import BackUpModal from './components/BackUpModal';
import { renderBadge } from '@/constants';
import { task } from './service';

const BACKUP_STATUS_ENUM = {
  noBackup: '未备份',
  backupSuccess: '备份成功',
  backupFailed: '备份失败',
  rollBackFailed: '回滚失败',
  rollBackSuccess: '回滚成功',
};

const TableList = () => {
  const [backUpModalVisible, handleBackUpModalVisible] = useState(false);
  const expandedRowRender = useCallback(
    (row) => {
      const data = row.exec_items || [];
      return <ProTable
        columns={[
          { title: '序号', dataIndex: 'id', align: 'center', },
          { title: '数据库', dataIndex: 'db_name', align: 'center', },
          { title: '任务类型', dataIndex: 'task_type', align: 'center', },
          { title: '影响行数', dataIndex: 'affect_rows', align: 'center', },
          { title: '状态', dataIndex: 'status', align: 'center', render: (status) => renderBadge(status) },
          { title: '执行信息', dataIndex: 'exec_info', align: 'center', },
          { title: 'SQL语句', dataIndex: 'sql_content', valueType: 'code', },
          { title: '备注', dataIndex: 'remark', align: 'center', },
          {
            title: '备份状态',
            dataIndex: 'backup_status',
            align: 'center',
            render: (backupStatus) => renderBadge(backupStatus,  BACKUP_STATUS_ENUM[backupStatus])
          },
          {
            title: '操作',
            dataIndex: 'option',
            align: 'center',
            render: (_, record) => {
              // if(record.back_status !== 'backupSuccess'){
              //   return '';
              // }
              return <a onClick={() => handleBackUpModalVisible(true)}>回滚</a>
            },
          }
        ]}
        rowKey="id"
        headerTitle={false}
        search={false}
        options={false}
        dataSource={data}
        pagination={false}
      />
    },
  []);
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '任务名',
      dataIndex: 'name',
      align: 'center',
      formItemProps: {
        label: '模糊搜索',
        name: 'key',
      },
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'ct',
      render: (v) => v ? moment.unix(v).format('YYYY-MM-DD HH:mm:ss') : '-',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '执行人',
      dataIndex: 'executor',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '完成时间',
      dataIndex: 'ft',
      render: (v) => v ? moment.unix(v).format('YYYY-MM-DD HH:mm:ss') : '-',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status_name',
      hideInSearch: true,
      align: 'center',
      render: (text, record) => {
        if(record.reject_content){
          return <Badge status="error" text={`${text} (理由: ${record.reject_content})`}></Badge>
        }
        return renderBadge(text);
      }
    },
  ];
  return (
    <PageContainer title="任务执行">
      <ProTable
        rowKey="id"
        search={{
          collapsed: false,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        options={false}
        expandable={{ expandedRowRender,}}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const pagination = {
            limit: pageSize,
            offset: (current - 1) * pageSize,
            ...rest,
          };
          const result = await task(pagination);
          return {
            total: result.total,
            data: result.items,
            success: true,
          }
        }}
        columns={columns}
      />
      <BackUpModal
        visible={backUpModalVisible}
        handleCancel={() => {
          handleBackUpModalVisible(false);
        }}
        handleOk={() => {
          handleBackUpModalVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default TableList;
