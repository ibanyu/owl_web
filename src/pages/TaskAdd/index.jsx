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
import { useRef } from "react";
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
  const dbs = Object.keys(data).reduce((acc, current) => {
    acc[current] = current;
    return acc;
  }, {});

  const onFinish = async (values) => {
    run(values);
  };

  return (
    <PageContainer>
      <Card bordered={false}>
        <ProForm
          scrollToFirstError
          requiredMark={false}
          style={{
            marginTop: 8,
          }}
          formRef={formRef}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          name="basic"
          layout="horizontal"
          submitter={{
            render: (props, doms) => {
              return [
                <Row key="submit">
                  <Col span={16} offset={8}>
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
            width="md"
            label="任务名称"
            name="title"
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
                    label: '增删数据',
                    value: 'DML',
                  },
                ]}
                label="创建类型"
                name="task_type"
              />
              <ProFormSelect
                showSearch
                valueEnum={dbs}
                name="db_name"
                label="数据库"
                placeholder="请选择数据库"
                rules={[
                  {
                    required: true,
                    message: '请选择数据库',
                  },
                ]}
              />
              <ProFormDependency name={['db_name']}>
                {({ db_name: dbName }) => {
                  return (
                    <ProFormSelect
                      showSearch
                      options={data[dbName] ? data[dbName].map(cluster => ({label: cluster, value: cluster})) : null}
                      width="md"
                      name="cluster_name"
                      rules={[
                        {
                          required: true,
                          message: '请选择集群',
                        },
                      ]}
                      label={`集群名`}
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
                itemRender={({ listDom, action, }, { record, field }, ...args) => {
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
                    width="md"
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
                    width="md"
                    name="remark"
                    fieldProps={{
                      autoSize: true,
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
           {/* <ProFormDependency name={['publicType']}>
            {({ publicType }) => {
              return (
                <ProFormSelect
                  width="md"
                  name="publicUsers"
                  fieldProps={{
                    style: {
                      margin: '8px 0',
                      display: publicType && publicType === '2' ? 'block' : 'none',
                    },
                  }}
                  options={[
                    {
                      value: '1',
                      label: '同事甲',
                    },
                    {
                      value: '2',
                      label: '同事乙',
                    },
                    {
                      value: '3',
                      label: '同事丙',
                    },
                  ]}
                />
              );
            }}
          </ProFormDependency> */}
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default BasicForm;
