import React, { Component, PureComponent } from 'react'

import { _, ClassNames, host } from '../../util'
import style from './table.css'

export default class Table extends PureComponent {
    constructor(props) {
        super(props)

        this.contextmenu = React.createRef()
    }
    componentWillMount() {
        this.init(this.props)
    }
    componentDidMount() {
        $(`.${style.main} > div:nth-child(2) .${style['body-wrapper']}`).scroll(function (e) {
            $(`.${style.fixed} .${style['body-wrapper']}`).prop('scrollTop', $(this).prop('scrollTop'))
        })
        $(`.${style.fixed} .${style['body-wrapper']}`).scroll(function (e) {
            // $(`.${style.main} > div:nth-child(2) .${style['body-wrapper']}`).prop('scrollTop', $(this).prop('scrollTop'))
        })

        const getRowIndex = target => {
            if (target.tagName === 'TR')
            {
                return $(target).index()
            } else if (target.tagName === 'TD')
            {
                return $(target).parent('tr').index()
            }
        }
        $(`.${style.main} > div:nth-child(2) .${style.body} tr`).hover(function (e) {
            $(`.${style.fixed} .${style['body-wrapper']} tr:nth-child(${getRowIndex(e.target) + 1})`).addClass(style.hover)
        }, function (e) {
            $(`.${style.fixed} .${style['body-wrapper']} tr:nth-child(${getRowIndex(e.target) + 1})`).removeClass(style.hover)
        })
        $(`.${style.fixed} .${style.body} tr`).hover(function (e) {
            $(`.${style.main} > div:nth-child(2) .${style['body-wrapper']} tr:nth-child(${getRowIndex(e.target) + 1})`).addClass(style.hover)
        }, function (e) {
            $(`.${style.main} > div:nth-child(2) .${style['body-wrapper']} tr:nth-child(${getRowIndex(e.target) + 1})`).removeClass(style.hover)
        })
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
    handleSort = e => {
        const props = this.state.cols.find(v => v.title === e.target.textContent)
        this.setState({
            data: this.state.data.sort(props.sorter),
            activeSort: props.title
        })
    }
    handleWheel = e => {
        const { offsetHeight, scrollTop, scrollHeight } = e.currentTarget
        const height = offsetHeight + scrollTop
        if (height >= scrollHeight - 1)
        {
            this.setState({ i: this.state.i + 1 })
        } else if (scrollTop === 0 && this.state.i > 1)
        {
            this.setState({ i: this.state.i - 1 })
        }
    }
    render() {
        let { data, cols } = this.state
        const fixedCols = cols.slice(0, 1)
        data = data.slice(0, this.state.i * 100)
        cols = cols.slice(1)

        return (
            <div className={style.main}
                onContextMenu={e => {
                    e.preventDefault()
                    const menu = this.contextmenu.current
                    menu.style.visibility = 'visible'
                    menu.style.left = e.clientX + 'px'
                    menu.style.top = e.clientY + 'px'
                }}
                onClick={e => {
                    if (e.button === 1)
                    {
                        menu.style.visibility = 'hidden'
                    }
                }}>
                <div style={{
                    visibility: 'hidden',
                    position: 'fixed',
                    width: '100px',
                    textAlign: 'center',
                    backgroundColor: 'white',
                    boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.1)'
                }} ref={this.contextmenu}>
                    <div>
                        <a onClick={e => {
                            this.props.export()
                        }}>导出</a>
                    </div>
                </div>
                <div className={style.fixed}>
                    <div className={style['head-wrapper']}>
                        <table className={style.head}>
                            <tbody>
                                <tr>
                                    {fixedCols.map((props, i) => (
                                        <th key={i}>
                                            {props.title}
                                        </th>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={style['body-wrapper']}>
                        <table className={style.body}>
                            <tbody>
                                {data.map((v, i) => (
                                    <tr>
                                        {fixedCols.map((props, i) => (
                                            <td title={v[props.dataIndex]} key={i}>
                                                {v[props.dataIndex]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <div className={style['head-wrapper']}>
                        <table className={style.head}>
                            <tbody>
                                <tr onClick={this.handleSort}>
                                    {cols.map((props, i) => (
                                        <th className={ClassNames(this.state.activeSort === props.title && style.active)}
                                            key={i}>
                                            {props.title}
                                        </th>
                                    ))}
                                    <th className={style.gutter}></th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={style['body-wrapper']} onWheel={this.handleWheel}>
                        <table className={style.body}>
                            <tbody>
                                {data.map((v, i) => (
                                    <tr key={i}>
                                        {cols.map(({ dataIndex }, i) => (
                                            <td key={i}>{v[dataIndex]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div >
            </div >
        )
    }
}

export const Column = () => { }
