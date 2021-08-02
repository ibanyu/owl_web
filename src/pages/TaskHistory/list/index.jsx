import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { task } from './service';

const expandedRowRender = (row) => {
  const data = row.exec_items || [];
  return <ProTable
    columns={[
      { title: '序号', dataIndex: 'id' },
      { title: '数据库', dataIndex: 'db_name' },
      { title: '任务类型', dataIndex: 'task_type' },
      { title: '影响行数', dataIndex: 'affect_rows' },
      { title: '状态', dataIndex: 'status' },
      { title: '执行信息', dataIndex: 'exec_info' },
      { title: 'SQL语句', dataIndex: 'sql_content', valueType: 'code' },
      { title: '备注', dataIndex: 'remark' },
    ]}
    rowKey="id"
    headerTitle={false}
    search={false}
    options={false}
    dataSource={data}
    pagination={false}
  />
}

const TableList = () => {
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '任务名',
      dataIndex: 'name',
      formItemProps: {
        label: '模糊搜索',
        name: 'key',
      },
    },
    {
      title: '状态',
      dataIndex: 'status_name',
      hideInSearch: true,
      render: (text, record) => {
        if(record.reject_content){
          return `${text} (理由: ${record.reject_content})`
        }
        return text;
      }
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'ct',
      render: (v) => v ? moment.unix(v).format('YYYY-MM-DD HH:mm:ss') : '-',
      hideInSearch: true,
    },
    {
      title: '执行人',
      dataIndex: 'executor',
      hideInSearch: true,
    },
    {
      title: '完成时间',
      dataIndex: 'ft',
      render: (v) => v ? moment.unix(v).format('YYYY-MM-DD HH:mm:ss') : '-',
      hideInSearch: true,
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
        expandable={{expandedRowRender}}
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
    </PageContainer>
  );
};

export default TableList;
