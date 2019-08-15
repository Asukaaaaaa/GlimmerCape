import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import Main from './pages/main/main'
import Sign from './pages/sign/sign'

import style from './index.css'


const App = () => {
    return (
        <Router>
            <Link to='/'>Home</Link>
            <Link to='/sign'>Sign</Link>

            <Route path='/' exact component={Main}></Route>
            <Route path='/sign' component={Sign}></Route>
        </Router>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
