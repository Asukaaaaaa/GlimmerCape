import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom"

import Main from './pages/main/main'
import SignForm from './pages/sign/sign'

import style from './index.css'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = { user: null }
    }
    render() {
        return (
            <Router>
                <Route
                    render={() => (
                        <Redirect to={this.state.user ? '/' : '/sign'} />
                    )}
                />
                <Switch>
                    <Route path='/sign'
                        render={() => <SignForm handleSign={user => this.setState({ user })} />}
                    />
                    <Route path='/' component={Main} />
                </Switch>
            </Router >
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
