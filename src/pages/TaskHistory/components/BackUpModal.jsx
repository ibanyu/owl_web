
import React, { useEffect, useMemo } from 'react';
import { Modal, message } from 'antd';
import { useRequest  } from 'umi';
import { Table } from 'antd';

import { queryBackUp, rollBack } from '../service';


const handleRollUp = async (data) => {
  const hide = message.loading('正在回滚');
  try {
    await rollBack(data);
    hide();
    message.success('回滚成功');
    return true;
  } catch (error) {
    hide();
    message.error('回滚失败，请重试～');
    return false;
  }
};

const formatBackUpData = (backUpInfo) => {
  const columnsTemp = backUpInfo.columns?.map((column, index) => ({
    key: index,
    title: column,
    dataIndex: column,
    align: "center",
    render: (v) => {
      if(Array.isArray(backUpInfo.index) && backUpInfo.index.includes(index)){
        return <span style={{color: 'red'}}>{v}</span>
      }
      return v;
    },
  }));
  const dataSourceTemp = backUpInfo.data_items?.map((row) => {
    return row.reduce((acc, current, columnIndex) => {
      const columnKey = backUpInfo.columns[columnIndex];
      acc[columnKey] =  current;
      return acc;
    },{})
  });
  return {
    columns: columnsTemp,
    dataSource: dataSourceTemp
  }
}

const BackUpModal = (props) => {
  const { visible, handleOk, handleCancel, data } = props;

  const { data: backUpInfo = {}, loading, run } = useRequest(() => queryBackUp({
    backup_id: data.backup_id,
    cluster_name: data.cluster_name,
    db_name: data.db_name,
    origin_sql: data.sql_content,
  }),{
    manual: true,
    formatResult: (resp) => resp,
  });

  useEffect(() => {
    if(visible){
      run();
    }
  }, [visible, run])

  const { columns, dataSource } = useMemo(() => formatBackUpData(backUpInfo), [backUpInfo])

  return (
    <Modal
      title="回滚"
      destroyOnClose
      visible={visible}
      onCancel={handleCancel}
      onOk={async () =>  {
        const success = await handleRollUp({
          backup_id: data.backup_id,
          cluster_name: data.cluster_name,
          db_name: data.db_name,
          origin_sql: data.sql_content,
        });
        if(success){
          handleOk();
        }
      }}
    >
      {!loading && <Table pagination={false} dataSource={dataSource} columns={columns} />}
    </Modal>
  );
}

export default BackUpModal;
