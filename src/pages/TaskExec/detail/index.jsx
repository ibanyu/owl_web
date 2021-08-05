import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormTextArea, ProFormDateTimePicker } from '@ant-design/pro-form';
import { Card, Descriptions, Divider, Button, Popconfirm } from 'antd';
import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { useRequest } from 'umi';
import moment from 'moment';
import { renderBadge } from '@/constants';

import { handleUpdate } from '../list/';
import { queryTaskProfile } from './service';
import styles from './style.less';


const TaskDetail = () => {
  let { id } = useParams();
  id = +id;
  const [modalVisible, handleModalVisible] = useState(false);
  const [scheduleModalVisible, handleScheduleModalVisible] = useState(false);
  const { data = {}, loading, refresh } = useRequest(() => {
    return queryTaskProfile(id);
  });
  const { exec_items: tableDataSource = [], edit_auth: operationAuth = {} } = data;

  const operationRender = (record) => {
    let operation = '';
    if(operationAuth.exec_enable){
      operation = <>
        <Popconfirm
          onConfirm={async () => {
            await handleUpdate({
              id,
              action: 'beginAt',
              exec_item: {
                  id: record.id,
              },
            });
            refresh();
          }}
          title={`确定执行么？`}
        >
          <a>
            执行
          </a>
        </Popconfirm>&nbsp;&nbsp;&nbsp;
        <Popconfirm
          onConfirm={async () => {
            await handleUpdate({
              id,
              action: 'skipAt',
              exec_item: {
                  id: record.id,
              },
            });
            refresh();
          }}
          title={`确定跳过执行么`}
        >
          <a>跳过执行</a>
        </Popconfirm>
      </>;
    }
    return operation;
  };
  const taskColumns = [
    { title: '序号', dataIndex: 'id', align: 'center', },
    { title: '数据库', dataIndex: 'db_name', align: 'center', },
    { title: '任务类型', dataIndex: 'task_type', align: 'center', },
    { title: '影响行数', dataIndex: 'affect_rows', align: 'center', },
    { title: '状态', dataIndex: 'status', align: 'center', render: (status) => renderBadge(status), },
    { title: '执行信息', dataIndex: 'exec_info', align: 'center', },
    { title: 'SQL语句', dataIndex: 'sql_content', valueType: 'code', },
    { title: '备注', dataIndex: 'remark', align: 'center', },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => operationRender(record),
    },
  ];
  return (
    <PageContainer
      header={{
        title: '执行页',
      }}
    >
      <Card bordered={false}>
        <Descriptions
          title="基本信息"
          column={4}
          style={{
            marginBottom: 32,
          }}
        >
          <Descriptions.Item label="任务名">{data.name}</Descriptions.Item>
          <Descriptions.Item label="任务id">{data.id}</Descriptions.Item>
          <Descriptions.Item label="状态">{renderBadge(data.status, data.status_name)}</Descriptions.Item>
          <Descriptions.Item label="创建者">{data.creator}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.ct ? moment.unix(data.ct).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
          <Descriptions.Item label="执行时间">{data.et ? moment.unix(data.et).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
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
          toolBarRender={() => [
            operationAuth.turn_down_exec_enable && <Popconfirm
              key="reject"
              onConfirm={async () => {
                handleModalVisible(true);
              }}
              title={`确定驳回 ${data.name} 么？`}
            >
              <Button key="button" type="danger">
                驳回
              </Button>
            </Popconfirm>,
            operationAuth.exec_enable && <Popconfirm
              key="exec"
              onConfirm={async () => {
                const success = await handleUpdate({
                  id,
                  action: 'progress',
                });
                if (success) {
                  handleModalVisible(false);
                  refresh();
                }
              }}
              title={`确定执行 ${data.name} 么？`}
            >
              <Button key="button" type="primary">
                执行
              </Button>
            </Popconfirm>,
            operationAuth.exec_enable && <Button
              key="schedule-exec"
              type="default"
              onClick={() => handleScheduleModalVisible(true)}
            >
              调度执行
            </Button>
            ].filter(Boolean)}
            dataSource={tableDataSource}
            columns={taskColumns}
            rowKey="id"
          />
      </Card>
      <ModalForm
        title="驳回"
        width="400px"
        modalProps={{destroyOnClose: true}}
        visible={modalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (fields) => {
          const success = await handleUpdate({
            id,
            action: 'reject',
            ...fields,
          });
          if (success) {
            handleModalVisible(false);
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
      <ModalForm
        title="调度执行"
        width="400px"
        modalProps={{
          destroyOnClose: true,
          maskClosable: false
        }}
        visible={scheduleModalVisible}
        onVisibleChange={handleScheduleModalVisible}
        onFinish={async (fields) => {
          const success = await handleUpdate({
            id,
            action: 'progress',
            ...fields,
            et: moment(fields.et).unix(),
          });
          if (success) {
            handleScheduleModalVisible(false);
            refresh();
          }
        }}
      >
        <ProFormDateTimePicker
          width="md"
          name="et"
          fieldProps={{
            disabledDate: (current) => {
              return current && current < moment();
            }
          }}
          label="开始时间"
          rules={[
            {
              required: true,
              message: '请选择开始时间',
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TaskDetail;
