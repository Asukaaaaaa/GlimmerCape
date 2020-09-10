import * as React from "react"
import * as ReactDom from "react-dom"
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from "react-router-dom"
//pages
import Home from "./pages/home/home"
import Main from "./pages/main/main"
import Admin from "./pages/admin/admin"
//styles
import "./app.less"

const obj = {
  user: null,
  setUser: null,
}
export const AppContext = React.createContext(obj)

const App = () => {
  const [user, setUser] = React.useState()
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}>
      <Router>
        <Switch>
          <Route
            path="/main"
            render={() =>
              user ? (
                <Route path="/main" component={Main} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route
            path="/admin"
            render={() =>
              user ? (
                <Route path="/admin" component={Admin} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </AppContext.Provider>
  )
}
ReactDom.render(<App />, document.getElementById("root"))

import {Icon, Spin} from "antd"
export const Loading = () => {
  return (
    <Spin
      className="cp-loading"
      indicator={<Icon type="loading" style={{fontSize: 36}} spin />}
    />
  )
}
