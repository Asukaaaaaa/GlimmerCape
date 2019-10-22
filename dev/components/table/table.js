import React, { Component, PureComponent } from 'react'

import { ClassNames } from '../../util'
import style from './table.css'

export default class Table extends PureComponent {
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
            i: 1
        })
    }
    handleSort(e) {
        const props = this.state.cols.find(v => v.title === e.target.textContent)
        this.setState({
            data: this.state.data.sort(props.sorter),
            activeSort: props.title
        })
    }
    handleWheel(e) {
        const { offsetHeight, scrollTop, scrollHeight } = e.currentTarget
        const height = offsetHeight + scrollTop
        if (height >= scrollHeight - 1) {
            this.setState({ i: this.state.i + 1 })
        } else if (scrollTop === 0 && this.state.i > 1) {
            this.setState({ i: this.state.i - 1 })
        }
    }
    render() {
        const { data, cols } = this.state
        const page = data.slice(0, this.state.i * 100)
        // subpage = data.slice(10, 20)

        return (
            <div className={style.main}>
                <table className={style.head}>
                    <tbody>
                        <tr onClick={this.handleSort.bind(this)}>
                            {this.props.children.flat().map(({ props }, i) => (
                                <th className={ClassNames(this.state.activeSort === props.title && style.active)}
                                    key={i}>
                                    {props.title}
                                </th>
                            ))}
                            <th className={style.gutter}></th>
                        </tr>
                    </tbody>
                </table>
                <div className={style['body-wrapper']} onWheel={this.handleWheel.bind(this)}>
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
            </div>
        )
    }
}

export const Column = () => { }
