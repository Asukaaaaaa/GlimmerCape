import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Table, { Column } from './components/table/table'
import data from '../static/coword.json'

export default class App extends Component {
    render() {
        return (
            <div>
                <Table data={data}>
                    <Column title="词汇" dataIndex="word" key="0" />
                    <Column title="2013" dataIndex="2013" key="1"
                        sorter={(a, b) => b['2013'] - a['2013']} />
                    <Column title="2014" dataIndex="2014" key="2"
                        sorter={(a, b) => b['2014'] - a['2014']} />
                </Table>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector('#root'))
