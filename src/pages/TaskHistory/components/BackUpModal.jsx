
import React from 'react';
import { Modal } from 'antd';
import moment from 'moment';


const BackUpModal = (props) => {
  const { visible, handleOk, handleCancel } = props;
  return <Modal
    title="回滚"
    destroyOnClose
    visible={visible}
    onOk={handleOk}
    onCancel={handleCancel}>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </Modal>
}

export default BackUpModal;
