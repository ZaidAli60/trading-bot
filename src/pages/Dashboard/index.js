// import React, { useState } from 'react'
// import { useAuthContext } from 'contexts/Auth';
// import { Layout, Menu } from 'antd';
// import Header from "components/dashboard/Header"
// import Routes from "./Routes"
// import { items } from "./SidebarItems"
// import Footer from 'components/dashboard/Footer/Footer';

// const { Content, Sider } = Layout;

// export default function Dashboard() {

//     const { user } = useAuthContext()
//     const [collpased, setCollapsed] = useState(false)

//     return (
//         <Layout>
//             <Header />
//             <Layout hasSider>
//                 <Sider theme="light" breakpoint='lg' collapsible collapsed={collpased} collapsedWidth="80px" width="240px" className='custom-sider position-fixed vh-100'
//                     onCollapse={(collapsed) => {
//                         setCollapsed(collapsed);
//                     }}
//                     style={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}
//                 >
//                     <Menu
//                         theme="light"
//                         mode="inline"
//                         defaultSelectedKeys={['4']}
//                         items={items.filter((item) => !item.allowedroles || user.roles?.find(role => item.allowedroles?.includes(role)))}
//                     />
//                 </Sider>

//                 <Content className='p-3 pb-0' style={{ marginLeft: collpased ? 80 : 240, transition: "all 0.2s" }}>
//                     <Routes />
//                     <Footer />
//                 </Content>
//             </Layout>
//         </Layout>
//     )
// }


import React, { useState } from 'react';
import { useAuthContext } from 'contexts/Auth';
import { Layout, Menu } from 'antd';
import Header from "components/dashboard/Header";
import Routes from "./Routes";
import { items } from "./SidebarItems";
import Footer from 'components/dashboard/Footer/Footer';

const { Content, Sider } = Layout;

export default function Dashboard() {
  const { user } = useAuthContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Header />
      <Layout hasSider>
        <Sider
          theme="dark"
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          collapsedWidth="80px"
          width="240px"
          className="custom-sider position-fixed vh-100"
          onCollapse={(collapsed) => {
            setCollapsed(collapsed);
          }}
          style={{
            background: '#0f172a',
            maxHeight: 'calc(100vh - 100px)',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              height: 64,
              margin: 16,
              background: '#1F2937',
              borderRadius: 8,
              textAlign: 'center',
              color: '#fff',
              lineHeight: '64px',
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            TradePro
          </div>

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['4']}
            style={{ background: '#0f172a', color: '#f1f5f9' }}
            items={items.filter((item) => !item.allowedroles || user.roles?.find(role => item.allowedroles?.includes(role)))}
          />
        </Sider>

        <Content
          className="p-3 pb-0"
          style={{
            marginLeft: collapsed ? 80 : 240,
            transition: 'all 0.2s',
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
          }}
        >
          <Routes />
          <Footer />
        </Content>
      </Layout >
    </Layout>
  );
}
