import React, {Component} from "react"
import {Icon, Dropdown, Menu} from "antd"
//
import "./home.less"
import logo from "@/assets/logo.png"
import {Link} from "react-router-dom"

const MoreMenu = (
  <Menu>
    <Menu.Item>
      <a
        // href="http://www.alipay.com/"
        target="_blank"
        rel="noopener noreferrer">
        常见问题
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        // href="http://www.taobao.com/"
        target="_blank"
        rel="noopener noreferrer">
        引导手册
      </a>
    </Menu.Item>
  </Menu>
)

export default class Home extends Component {
  render() {
    return (
      <div>
        <main>
          <div className="iframe-container"></div>
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <ul className="nav">
            <li className="item">
              <Dropdown
                overlay={MoreMenu}
                placement="bottomCenter"
                //TODO global dark style class
                overlayStyle={{paddingTop: "12px"}}>
                <a target="_blank" style={{color: "white"}}>
                  更多
                </a>
              </Dropdown>
            </li>
            <li className="item">
              <span>注册/登录</span>
            </li>
          </ul>
          <div className="tool">
            <div>
              <Icon
                style={{fontSize: "2rem", margin: "0 26px 0 22px"}}
                type="plus"
              />
              <span style={{fontSize: "25px"}}>添加模型</span>
            </div>
          </div>
          <div className="info">
            <Link to="/help">
              <Icon type="question-circle" theme="filled" className="help" />
            </Link>
            {/* <div className="copyright">
              <p>©️some word here</p>
            </div> */}
          </div>
        </main>
      </div>
    )
  }
}
