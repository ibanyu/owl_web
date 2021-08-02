import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  const year = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${year} 伴鱼前端`}
      links={[
        {
          key: 'Palfish Web',
          title: 'Palfish Web',
          href: 'http://tech.ipalfish.com/blog/about/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/ibanyu',
          blankTarget: true,
        },
        {
          key: 'Palfish Tech',
          title: 'Palfish Tech',
          href: 'https://www.zhihu.com/people/119841026',
          blankTarget: true,
        },
      ]}
    />
  );
};
