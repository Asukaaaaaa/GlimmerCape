import * as React from 'react'
import * as ReactDom from 'react-dom'
import { HashRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom'
//pages
import Main from './pages/main/main'
import Sign from './pages/sign/sign'
//styles
import './app.less'

const obj = {
  user: null, setUser: null,
}
export const AppContext = React.createContext(obj)

const App = () => {
  const [user, setUser] = React.useState()
  return (
    <AppContext.Provider value={{
      user, setUser
    }}>
      <Router>
        <Switch>
          <Route path='/sign' component={Sign} />
          <Route render={props => (
            user ?
              <Route path='/' component={Main} /> :
              null)}>
          </Route>
        </Switch>
        <Redirect to={user ? '/' : '/sign'} />
      </Router>
    </AppContext.Provider>
  )
}
ReactDom.render(<App />, document.getElementById('root'))

import { Icon, Spin } from 'antd'
export const Loading = () => {
  return <Spin className='cp-loading' indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} />
}