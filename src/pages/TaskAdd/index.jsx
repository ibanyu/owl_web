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
      message.success('ζδΊ€ζε');
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
                      ζδΊ€ζ£ζ΅
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
            label="δ»»ε‘εη§°"
            name="name"
            rules={[
              {
                required: true,
                message: 'θ―·θΎε₯δ»»ε‘εη§°',
              },
            ]}
            placeholder="θ―·θΎε₯δ»»ε‘εη§°"
          />
          <ProFormList
            name="sub_tasks"
            label="SQLιη½?"
            rules={[
              {
                required: true,
                message: 'θ―·ιζ©εε»Ίη±»ε',
              },
            ]}
            creatorButtonProps={{
              creatorButtonText: 'ζ·»ε SQLιη½?'
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
                  title={`ιη½?.${field.name + 1}`}
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
                    message: 'θ―·ιζ©εε»Ίη±»ε',
                  },
                ]}
                options={[
                  {
                    label: 'ε»Ίθ‘¨',
                    value: 'CREATE',
                  },
                  {
                    label: 'ζΉθ‘¨',
                    value: 'UPDATE',
                  },
                  {
                    label: 'ε’ε ζΉζ°ζ?',
                    value: 'DML',
                  },
                ]}
                label="εε»Ίη±»ε"
                name="task_type"
              />
              <ProFormSelect
                showSearch
                valueEnum={clusters}
                width="lg"
                name="cluster_name"
                label="ιηΎ€ε"
                placeholder="θ―·ιζ©ιηΎ€ε"
                rules={[
                  {
                    required: true,
                    message: 'θ―·ιζ©ιηΎ€ε',
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
                          message: 'θ―·ιζ©ζ°ζ?εΊ',
                        },
                      ]}
                      label={`ζ°ζ?εΊ`}
                    />
                  );
                }}
              </ProFormDependency>
              <ProFormList
                name="exec_items"
                style={{width: '100%'}}
                label={false}
                creatorButtonProps={{
                  creatorButtonText: 'ζ·»ε SQL'
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
                    placeholder="ε»Ίθ‘¨/ζΉθ‘¨: ζ―δΈͺζ‘εͺθ½εδΈζ‘sql &#13;&#10;ε’ε ζΉζ°ζ?οΌζ―δΈͺζ‘δΈ­ε―εε€ζ‘sql, ζ―δΈͺsqlδ»₯θ±ζεε·εεθ½¦η»ε°Ύ "
                    rules={[
                      {
                        required: true,
                        message: 'θ―·θΎε₯SQL',
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
                    label="ε€ζ³¨"
                    help="ε»Ίθ‘¨θ―·ε‘«εε€ζ³¨"
                    placeholder="θ―·η»εΊε»Ίθ‘¨ζΆεηζζζ₯θ―’ζζ΄ζ°θ―­ε₯οΌδΎΏδΊDBAθ―δΌ°η΄’εΌ&#13;&#10;ε¦ζ₯θ―’ζζ΄ζ°ζ‘δ»Ά&#13;&#10;where A=?&#13;&#10;where A=? and B=?"
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
