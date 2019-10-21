import React, { Component, PureComponent } from 'react'

import { ClassNames } from '../../util'
import style from './table.css'

export default class Table extends Component {
    componentWillMount() {
        this.init(this.props)
    }
    componentWillReceiveProps(props) {
        this.init(props)
    }
    init({ data, children }) {
        const cols = children.flat().map(({ props }) => props)
        this.setState({
            data, cols,
        })
    }
    handleSort(e) {
        const props = this.state.cols.find(v => v.title === e.target.textContent)
        this.setState({
            data: this.state.data.sort(props.sorter)
        })
    }
    render() {
        const { data, cols } = this.state
        const page = data.slice(0, 10),
            subpage = data.slice(10, 20)

        return (
            <div className={style.main}>
                <table className={style.head}>
                    <tbody>
                        <tr onClick={this.handleSort.bind(this)}>
                            {this.props.children}
                        </tr>
                    </tbody>
                </table>
                <table className={style.body}>
                    <tbody>
                        {page.map((v, i) => (
                            <tr key={i}>
                                {cols.map(({ dataIndex }, i) => (
                                    <td key={i}>{v[dataIndex]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export const Column = ({ title, width }) => {
    return (
        <th width={width}>{title}</th>
    )
}
