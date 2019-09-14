import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom"

import Main from './pages/main/main'
import SignForm from './pages/sign/sign'

import style from './index.css'

const MainContext = React.createContext()

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            setUser: user => this.setState({ user })
        }
    }
    render() {
        return (
            <MainContext.Provider value={this.state}>
                <Router>
                    <Route
                        render={() => (
                            <Redirect to={this.state.user.account ? '/' : '/sign'} /> // TODO
                        )}
                    />
                    <Switch>
                        <Route path='/sign'
                            render={() => <SignForm handleSign={user => this.setState({ user })} />}
                        />
                        <Route path='/' component={Main} />
                    </Switch>
                </Router >
            </MainContext.Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))

export {
    MainContext
}