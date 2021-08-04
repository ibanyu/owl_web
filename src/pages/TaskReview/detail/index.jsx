import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import { Card, Descriptions, Divider, Button, Popconfirm } from 'antd';
import React, { useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { useRequest } from 'umi';
import moment from 'moment';
import { renderBadge } from '@/constants';

import { handleUpdate } from '../list';
import { queryTaskProfile } from './service';
import styles from './style.less';


const TaskDetail = () => {
  let { id } = useParams();
  const history = useHistory();
  id = +id;
  /** 编辑modal */
  const [modalVisible, handleModalVisible] = useState(false);
  /** 驳回modal */
  const [rejectModalVisible, handleRejectModalVisible] = useState(false);
  const [formValues, handleFormValues] = useState({});
  const { data = {}, loading, refresh } = useRequest(() => {
    return queryTaskProfile(id);
  });
  const { exec_items: tableDataSource = [], edit_auth: operationAuth = {}} = data;
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
    { title: '序号', dataIndex: 'id', align: 'center', },
    { title: '数据库', dataIndex: 'db_name', align: 'center', },
    { title: '任务类型', dataIndex: 'task_type', align: 'center', },
    { title: '影响行数', dataIndex: 'affect_rows', align: 'center',  },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (status) => {
        return renderBadge(status);
      },
    },
    { title: '错误信息', dataIndex: 'rule_comments',valueType: 'code', align: 'center', },
    { title: 'SQL语句', dataIndex: 'sql_content', valueType: 'code', },
    { title: '备注', dataIndex: 'remark', align: 'center', },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
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
          column={4}
          title="基本信息"
          style={{
            marginBottom: 32,
          }}
        >
          <Descriptions.Item label="任务">{data.name}({data.id})</Descriptions.Item>
          <Descriptions.Item label="状态">
            {renderBadge(data.status, data.status_name)}
          </Descriptions.Item>
          <Descriptions.Item label="创建者">{data.creator}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.ct ? moment.unix(data.ct).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
        </Descriptions>
        <Divider
          style={{
            marginBottom: 32,
          }}
        />
        <div className={styles.title}>任务明细</div>
        <ProTable
          toolBarRender={() => [
            operationAuth.turn_down_enable && <Popconfirm
              key="reject"
              onConfirm={async () => {
                handleRejectModalVisible(true);
              }}
              title={`确定驳回么？`}
            >
              <Button type="danger"> 驳回</Button>
            </Popconfirm>,
            operationAuth.review_pass_enable && <Popconfirm
              key="approve"
              onConfirm={async () => {
                const success = await handleUpdate({
                  id,
                  action: 'progress',
                });
                if(success){
                  history.push(`/task/detail/${id}`)
                }
              }}
              title={`确定审核通过么？`}
            >
              <Button type="primary"> 审核通过</Button>
            </Popconfirm>,
            operationAuth.creator_turn_down_enable && <Popconfirm
              key="cancel"
              onConfirm={async () => {
                await handleUpdate({
                  id,
                  action: 'cancel',
                });
                refresh();
              }}
              title={`确定撤销么？`}
            >
              <Button type="default"> 撤销</Button>
            </Popconfirm>,

          ].filter(Boolean)}
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
        width="700px"
        className="aaaaaaa"
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
          width="ls"
          name="sql_content"
          label="SQL"
          fieldProps={{autoSize: { minRows: 5}, minRows: 5}}
          rules={[
            {
              required: true,
              message: '请输入SQL',
            },
          ]}
        />
        <ProFormTextArea
          width="ls"
          name="remark"
          fieldProps={{autoSize: { minRows: 5}, minRows: 5}}
          label="备注"
        />
      </ModalForm>
      <ModalForm
        title="驳回"
        width="400px"
        modalProps={{destroyOnClose: true}}
        visible={rejectModalVisible}
        onVisibleChange={handleRejectModalVisible}
        onFinish={async (fields) => {
          const success = await handleUpdate({
            id,
            action: 'reject',
            ...fields,
          });
          if (success) {
            handleRejectModalVisible(false);
            refresh();
          }
        }}
      >
        <ProFormTextArea
          width="md"
          name="reject_content"
          label="驳回理由"
          rules={[
            {
              required: true,
              message: '请输入驳回理由',
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TaskDetail;
