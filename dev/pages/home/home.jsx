import React, {Component} from "react"
import {Link, Route} from "react-router-dom"
import {Icon, Dropdown, Menu} from "antd"
//
import "./home.less"
import logo from "@/assets/logo.png"
import Sign from "../sign/sign"
import {AppContext} from "../../app"

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
      <a href="./guide/intro.html" target="_blank" rel="noopener noreferrer">
        引导手册
      </a>
    </Menu.Item>
  </Menu>
)

const SignModal = () => (
  <div
    className="sign-modal"
    style={{
      top: "0",
      right: "-800px",
      position: "fixed",
      width: "800px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      transition: ".5s linear",
      // transform: "translateX(-800px)",
      boxShadow: "rgba(0, 0, 0, 0.25) 2px 0px 8px 0px",
      backgroundColor: "white",
    }}>
    <Sign />
  </div>
)

export default class Home extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {({user, setUser}) => (
          <div>
            <main>
              <div className="iframe-container">
                <iframe src="./iframes/chart0.html" frameBorder="0" />
              </div>
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="" style={{height: "3rem"}} />
                </Link>
              </div>
              <ul className="nav">
                <li className="item" id="more-menu">
                  <Dropdown
                    // trigger="click"
                    overlay={MoreMenu}
                    placement="bottomCenter"
                    getPopupContainer={() =>
                      document.getElementById("more-menu")
                    }
                    //TODO global dark style class
                    overlayStyle={{paddingTop: "12px"}}>
                    <a>更多</a>
                  </Dropdown>
                </li>
                <li className="item">
                  <Link
                    to={
                      this.props.location.pathname.includes("sign")
                        ? "/"
                        : "/sign"
                    }>
                    注册/登录
                  </Link>
                </li>
                <Route path="/sign">
                  <li className="item">
                    <Link to="/">
                      <Icon type="close-circle" />
                    </Link>
                  </li>
                </Route>
              </ul>
              <div className="tool">
                <div
                  onClick={e => {
                    if (user) {
                      this.props.history.push(user.isAdmin ? "/admin" : "/main")
                    } else {
                      this.props.history.push("/sign")
                    }
                  }}>
                  <Icon
                    style={{fontSize: "2rem", margin: "0 26px 0 22px"}}
                    type="plus"
                  />
                  <strong style={{fontSize: "25px"}}>添加模型</strong>
                </div>
              </div>
              <div className="info">
                <Link to="/help">
                  <Icon
                    type="question-circle"
                    theme="filled"
                    className="help"
                  />
                </Link>
                {/* <div className="copyright">
              <p>©️some word here</p>
            </div> */}
              </div>
            </main>
            <Route path="/sign" component={SignModal} />
          </div>
        )}
      </AppContext.Consumer>
    )
  }
}
