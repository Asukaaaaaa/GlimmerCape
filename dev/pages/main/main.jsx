import React, {Component, useContext} from "react"
import {Route, Link, Switch, Redirect} from "react-router-dom"
import {Modal, Form, Input, Button} from "antd"
//
import Header from "../../components/header/header"
import Sider from "../../components/sider/sider"
import Projects from "../../components/projects/projects"
import User from "../../components/user/user"
import ProjectDetail from "../../components/project-detail/project-detail"
import ModelDetail from "../../components/model-detail/model-detail"
import Toolbar from "../../components/toolbar/toolbar"
import {AppContext} from "../../app"
import {_BASE, ajaxer} from "../../utils"
//styles
import "./main.less"

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      indexUpdate: 0,
    }
  }
  render() {
    const {state} = this
    return (
      <AppContext.Consumer>
        {({user}) => (
          <div
            className="pg-main"
            onClick={e => this.state.tabOn && this.setState({tabOn: false})}>
            <Header
              handleClickTab={() => this.setState({tabOn: true})}
              handleClickUser={userOn => this.setState({userOn})}
            />
            <User active={state.userOn} />
            <Route exact path="/main">
              <div className="pm-createproj">
                <span>创建新项目</span>
                <div>
                  <img
                    src={require("./cross.png")}
                    onClick={e => this.setState({showCpModal: true})}
                  />
                </div>
                <Modal
                  title="创建项目"
                  footer={null}
                  visible={this.state.showCpModal}
                  destroyOnClose
                  onCancel={e => this.setState({showCpModal: false})}>
                  <WrappedModalForm
                    handleSubmit={e => this.setState({showCpModal: false})}
                  />
                </Modal>
              </div>
              <Projects update={state.indexUpdate} />
            </Route>
            <Route path="/main/project/:id" component={ProjectDetail} />
            <Route path="/main/model/:id" component={ModelDetail} />
            <Toolbar />
          </div>
        )}
      </AppContext.Consumer>
    )
  }
}

const ModalForm = ({form, handleSubmit}) => {
  const appCtx = useContext(AppContext)
  const {getFieldDecorator} = form
  return (
    <Form
      className=""
      onSubmit={e => {
        e.preventDefault()
        form.validateFields((err, values) => {
          if (!err)
            ajaxer
              .post("/project/createProject", {
                "project.user_id": appCtx.user.userId,
                "project.project_name": values.name,
                "project.project_desc": values.desc,
              })
              .then(res => handleSubmit())
        })
      }}>
      <Form.Item>
        {getFieldDecorator("name", {
          rules: [{required: true, message: "Please input project name!"}],
        })(<Input placeholder="Projct Name" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("desc")(
          <Input placeholder="Project Description" rows={2} />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="">
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}
const WrappedModalForm = Form.create()(ModalForm)
