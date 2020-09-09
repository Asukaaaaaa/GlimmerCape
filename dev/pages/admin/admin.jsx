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
    users: [],
    auths: []
  }

  siderToggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  componentDidMount() {
    //注册用户
    ajaxer.get('/admin/getUserList', {
      page_num: 1,
      page_size: 100
    }).then(res => {
      this.setState({
        users: res.list.map((v, i) => {
          v.key = i
          return v
        })
      })
    })
    //注册机构
    ajaxer.get('/admin/getAuthority', {
      page_num: 1,
      page_size: 100
    }).then(res => {
      this.setState({
        auths: res
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
          <Header className='as-header'>
            <Icon className="as-trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.siderToggle} />
          </Header>
          <Content className='as-content'>
            <div className='ac-block'
              style={{
                flex: '1 0 80%'
              }}>
              <Table scroll={{ y: 360 }} pagination={false} footer={() => '已注册用户'}
                dataSource={this.state.users} loading={!Boolean(this.state.users)}>
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
            </div>
            <div className='ac-block auths'
              style={{
                flex: '0 0 20%'
              }}>
              <div className='title'>
                已注册机构
              </div>
              <div className='content'>
                {this.state.auths.map(a => (
                  <Tag color='blue' key={a.institution}
                    onClick={e => this.setState({ authFilter: a.institution })}>
                    {a.institution}
                  </Tag>
                ))}
              </div>
              <div className='modal'
                style={{
                  display: this.state.authFilter ? '' : 'none'
                }} onClick={e => this.setState({ authFilter: '' })}>
                <div className='md-panel'
                  onClick={e => e.stopPropagation()}>
                  <Table scroll={{ y: 480 }} pagination={false} footer={() => '已注册用户'}
                    dataSource={this.state.users.filter(v => v.institution == this.state.authFilter)} loading={!Boolean(this.state.users)}
                    style={{
                      border: '1px solid #f0f0f0',
                      padding: '2px'
                    }}>
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
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}
