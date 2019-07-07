import React from 'react'
import ReactDOM from 'react-dom'

import Main from './pages/main/main'

import './index.styl'

const App = () => {
    return (
        <div>
            <h1>Hello World!</h1>
            <Main></Main>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
