import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import { Card, Descriptions, Divider, Button, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import { useRequest } from 'umi';
import moment from 'moment';

import { handleUpdate } from '../list';
import { queryTaskProfile } from './service';
import styles from './style.less';


const TaskDetail = () => {
  let { id } = useParams();
  id = +id;
  const [modalVisible, handleModalVisible] = useState(false);
  const [formValues, handleFormValues] = useState({});
  const { data = {}, loading, refresh } = useRequest(() => {
    return queryTaskProfile(id);
  });
  const { exec_items: tableDataSource = []} = data;

  const operationRender = (record) => {
      return <>
        <Button
          type="link"
          onClick={async () => {
            handleFormValues(record);
            handleModalVisible(true);
          }}
        >
          编辑
        </Button>
        <Popconfirm
          onConfirm={async () => {
            await handleUpdate({
              id,
              exec_item: {
                  id: record.id,
              },
              action: 'delItem',
            });
            refresh();
          }}
          title={`确定删除么？`}
        >
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>
    </>
  };
  const taskColumns = [
    { title: '序号', dataIndex: 'id' },
    { title: '数据库', dataIndex: 'db_name' },
    { title: '任务类型', dataIndex: 'task_type' },
    { title: '影响行数', dataIndex: 'affect_rows' },
    { title: '状态', dataIndex: 'status' },
    { title: '错误信息', dataIndex: 'rule_comments',valueType: 'code',},
    { title: '执行信息', dataIndex: 'exec_info' },
    { title: 'SQL语句', dataIndex: 'sql_content', valueType: 'code' },
    { title: '备注', dataIndex: 'remark' },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => operationRender(record),
    },
  ];
  return (
    <PageContainer
      header={{
        title: '检测结果页',
      }}
    >
      <Card bordered={false}>
        <Descriptions
          title="基本信息"
          style={{
            marginBottom: 32,
          }}
        >
          <Descriptions.Item label="任务">{data.name}({data.id})</Descriptions.Item>
          <Descriptions.Item label="创建者">{data.creator}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.ct ? moment.unix(data.ct).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
          <Descriptions.Item label="状态">{data.status_name}</Descriptions.Item>
        </Descriptions>
        <Divider
          style={{
            marginBottom: 32,
          }}
        />
        <div className={styles.title}>任务明细</div>
        <ProTable
          style={{
            marginBottom: 24,
          }}
          pagination={false}
          search={false}
          loading={loading}
          options={false}
          dataSource={tableDataSource}
          columns={taskColumns}
          rowKey="id"
        />
      </Card>
      <ModalForm
        title="编辑"
        width="400px"
        initialValues={formValues}
        modalProps={{destroyOnClose: true}}
        visible={modalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (fields) => {
          const success = await handleUpdate({
            id,
            action: 'editItem',
            exec_item: {
              id: formValues.id,
              ...fields,
            },
          });
          if (success) {
            handleModalVisible(false);
            refresh();
          }
        }}
      >
        <ProFormTextArea
          width="md"
          name="sql_content"
          label="SQL"
          fieldProps={{autoSize: true}}
          rules={[
            {
              required: true,
              message: '请输入SQL',
            },
          ]}
        />
        <ProFormTextArea
          width="md"
          name="remark"
          fieldProps={{autoSize: true}}
          label="备注"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TaskDetail;
