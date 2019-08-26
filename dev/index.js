import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"

import Main from './pages/main/main'
import Sign from './pages/sign/sign'

import style from './index.css'


const App = () => {
    return (
        <Router>
            <Switch>
                <Route path='/sign' component={Sign} />
                <Route path='/' component={Main} />
            </Switch>
        </Router>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
