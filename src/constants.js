import { Badge } from 'antd';

export const TOKEN_KEY = '@@dbinjection_token';

export const renderBadge = (status = '', nickStatus) => {
  const statusDesc = status.toLocaleLowerCase();
  const nickText = nickStatus || status;
  if(statusDesc.includes('fail')){
    return <Badge status="error" text={nickText} />
  }
  if(statusDesc.includes('success')){
    return <Badge status="success" text={nickText} />
  }
  return <Badge status="processing" text={nickText} />
}
