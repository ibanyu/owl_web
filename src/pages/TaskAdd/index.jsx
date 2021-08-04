import { Card, message, Button, Row, Col } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormGroup,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormList,
} from '@ant-design/pro-form';
import { useRef, useMemo } from "react";
import { useRequest } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { useHistory } from "react-router-dom";
import { dataBase, addTask } from './service';
// import styles from './style.less';
import './style.css';

const BasicForm = () => {
  const history = useHistory();
  const { run } = useRequest(addTask, {
    manual: true,
    onSuccess: ({id}) => {
      message.success('提交成功');
      history.push(`/task/review/detail/${id}`);
    },
  });
  const formRef = useRef(null);

  const { data = {} } = useRequest(dataBase, {});

  const formatDBClusters = (dbClusters) => {
    const clusterMapDB = {};
    Object.entries(dbClusters).forEach(([dbName, clusters]) => {
      clusters.reduce((acc, cluster) => {
        acc[cluster] = acc[cluster] || [];
        acc[cluster].push(dbName);
        return acc;
      }, clusterMapDB)
    });
    return clusterMapDB;
  }
  const clusterDBs = useMemo(() => formatDBClusters(data), [data]);

  const clusters = Object.keys(clusterDBs).reduce((acc, current) => {
    acc[current] = current;
    return acc;
  }, {});

  const dbs = Object.keys(data).reduce((acc, current) => {
    acc[current] = current;
    return acc;
  }, {});

  const onFinish = async (values) => {
    run(values);
  };

  return (
    <PageContainer className="task__add--container">
      <Card bordered={false}>
        <ProForm
          scrollToFirstError
          requiredMark={false}
          style={{
            marginTop: 8,
          }}
          formRef={formRef}
          labelCol={{span: 5}}
          wrapperCol={{span: 16}}
          name="basic"
          layout="horizontal"
          submitter={{
            render: (props, doms) => {
              return [
                <Row key="submit">
                  <Col span={10} offset={5}>
                    <Button type="primary"  onClick={() => props.form?.submit?.()}>
                      提交检测
                  </Button>
                  </Col>
                </Row>
              ];
            },
          }}
          onFinish={onFinish}
        >
          <ProFormText
            width="lg"
            label="任务名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入任务名称',
              },
            ]}
            placeholder="请输入任务名称"
          />
          <ProFormList
            name="sub_tasks"
            label="SQL配置"
            rules={[
              {
                required: true,
                message: '请选择创建类型',
              },
            ]}
            creatorButtonProps={{
              creatorButtonText: '添加SQL配置'
            }}
            initialValue={[
              {
                task_type: 'CREATE'
              },
            ]}
            itemRender={({ listDom, action, }, { record, field }) => {
              return (
                <ProCard
                  bordered
                  className="group__wrapper"
                  extra={action}
                  title={`配置.${field.name + 1}`}
                  style={{
                    marginBottom: 8
                  }}
                >
                  {listDom}
                </ProCard>
              );
            }}
          >
            <ProFormGroup>
              <ProFormRadio.Group
                initialValue="CREATE"
                rules={[
                  {
                    required: true,
                    message: '请选择创建类型',
                  },
                ]}
                options={[
                  {
                    label: '建表',
                    value: 'CREATE',
                  },
                  {
                    label: '改表',
                    value: 'UPDATE',
                  },
                  {
                    label: '增删改数据',
                    value: 'DML',
                  },
                ]}
                label="创建类型"
                name="task_type"
              />
              <ProFormSelect
                showSearch
                valueEnum={clusters}
                width="lg"
                name="cluster_name"
                label="集群名"
                placeholder="请选择集群名"
                rules={[
                  {
                    required: true,
                    message: '请选择集群名',
                  },
                ]}
              />
              <ProFormDependency name={['cluster_name']}>
                {({ cluster_name: clusterName }) => {
                  return (
                    <ProFormSelect
                      showSearch
                      width="lg"
                      options={clusterDBs[clusterName] ? clusterDBs[clusterName].map(db => ({label: db, value: db})) : null}
                      name="db_name"
                      rules={[
                        {
                          required: true,
                          message: '请选择数据库',
                        },
                      ]}
                      label={`数据库`}
                    />
                  );
                }}
              </ProFormDependency>
              <ProFormList
                name="exec_items"
                style={{width: '100%'}}
                label={false}
                creatorButtonProps={{
                  creatorButtonText: '添加SQL'
                }}
                itemRender={({ listDom, action, }, { field }) => {
                  return (
                    <ProCard
                      bordered
                      extra={action}
                      title={`SQL.${field.name + 1}`}
                      style={{
                        marginBottom: 8,
                      }}
                    >
                      {listDom}
                    </ProCard>
                  );
                }}
              >
                <ProForm.Group>
                  <ProFormTextArea
                    width="lg"
                    name="sql_content"
                    fieldProps={{autoSize: { minRows: 5,}, minRows: 5}}
                    label="SQL"
                    placeholder="建表/改表: 每个框只能写一条sql &#13;&#10;增删改数据：每个框中可写多条sql, 每个sql以英文分号和回车结尾 "
                    rules={[
                      {
                        required: true,
                        message: '请输入SQL',
                      },
                    ]}
                  />
                  <ProFormTextArea
                    width="lg"
                    name="remark"
                    fieldProps={{
                      autoSize: { minRows: 5,},
                      minRows: 5,
                      labelCol:{span: 4}
                    }}
                    label="备注"
                    help="建表请填写备注"
                    placeholder="请给出建表涉及的所有查询或更新语句，便于DBA评估索引&#13;&#10;如查询或更新条件&#13;&#10;where A=?&#13;&#10;where A=? and B=?"
                  />
                </ProForm.Group>
              </ProFormList>
            </ProFormGroup>
          </ProFormList>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default BasicForm;
