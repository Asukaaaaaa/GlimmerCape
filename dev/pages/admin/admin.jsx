import React from 'react'
//
import { Layout, Menu, Icon } from 'antd'
const { Header, Sider, Content } = Layout
import { Table, Divider, Tag } from 'antd'
const { Column } = Table
import { ajaxer } from '../../utils'
//
import './admin.less'

export default class Admin extends React.PureComponent {
  state = {
    collapsed: false,
  }

  siderToggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  componentDidMount() {
    // signed user
    ajaxer.get('/admin/getUserList', {
      page_num: 1,
      page_size: 100
    }).then(res => {
      this.setState({
        signedUser: res.list.map((v, i) => {
          v.key = i
          return v
        })
      })
    })
  }

  render() {
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="as-logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              background: '#fff', padding: 0
            }}>
            <Icon className="as-trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.siderToggle} />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}>
            <Table dataSource={this.state.signedUser} loading={!Boolean(this.state.signedUser)}>
              <Column title='姓名' dataIndex='name' />
              <Column title="账号" dataIndex="account" />
              <Column title="电话" dataIndex="phone" />
              <Column title="邮箱" dataIndex="eMail" />
              <Column title="机构" dataIndex="institution"
                render={inst => (
                  <span>
                    <Tag color="blue" key={inst}>
                      {inst}
                    </Tag>
                  </span>
                )} />
              <Column title='注册时间' dataIndex='createTime'
                render={time => {
                  if (!window._timer_)
                    window._timer_ = new Date()
                  window._timer_.setTime(time)
                  return (
                    <span>
                      {window._timer_.toLocaleString()}
                    </span>
                  )
                }} />
            </Table>
          </Content>
        </Layout>
      </Layout>
    )
  }
}
