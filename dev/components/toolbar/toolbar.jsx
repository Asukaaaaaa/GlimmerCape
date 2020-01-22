import React, { useState, useEffect, useRef } from 'react'

import { AppContext, Loading } from '../../app'
import Table, { Column } from '../table/table'
import sticker from '../../../static/img/流汗.svg'
import { ClassNames, _BASE, ajaxer } from '../../utils'
//
import './toolbar.less'
import style from './toolbar.css'


export default function Toolbar() {
    const [active, setActive] = useState()
    const [on, setOn] = useState('')
    return (
        /*<div className={style.main}>
            <img className={style.sticker} src={sticker}
                onClick={e => setActive(!active)} />
            <div className={ClassNames(style.menu, active && style.active)}>
                <div>
                    <a style={{ verticalAlign: '-webkit-baseline-middle' }}
                        href={_BASE + '/操作手册.docx'}
                        download='操作手册.docx'>
                        操作手册</a>
                </div>
                <div></div>
                <div></div>
            </div>
        </div>*/
        <React.Fragment>
            < div className={ClassNames('cp-toolbar', active && 'active')} >
                <svg className='tb-plus tb-item'
                    onClick={e => setActive(!active)}
                    t="1578816575609" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8258" width="64" height="64">
                    <path d="M899.437541 570.198493 568.89122 570.198493l0 330.508459c0 32.216749-26.103518 58.397015-58.341756 58.397015-32.216749 0-58.283428-26.180266-58.283428-58.397015L452.266036 570.198493 121.718691 570.198493c-32.217772 0-58.359152-26.121937-58.359152-58.340733s26.14138-58.284451 58.359152-58.284451l330.547345 0L452.266036 122.969683c0-32.17991 26.066679-58.340733 58.283428-58.340733 32.238238 0 58.341756 26.160823 58.341756 58.340733L568.89122 453.573309l330.547345 0c32.218796 0 58.359152 26.065655 58.359152 58.284451S931.656337 570.198493 899.437541 570.198493" p-id="8259" fill="#8a8a8a"></path>
                </svg>
                <div className='tb-toolsbox'>

                    <AppContext.Consumer>
                        {({ user }) => (
                            <div className='tb-tools'>
                                <svg title='用户手册' t="1578818487241" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9367" width="64" height="64">
                                    <path d="M896 192v704H256.8c-71.2 0-128.8-57.6-128.8-128.8V256.8C128 185.6 185.6 128 256.8 128H768v512H257.6c-36 0-65.6 29.6-65.6 65.6v60.8c0 36 29.6 65.6 65.6 65.6H832V192h64zM768 704H256v64h512v-64z" p-id="9368" fill="#8a8a8a"></path>
                                </svg>
                                <svg className={ClassNames('tt-admin', user.admin || 'disable')}
                                    onClick={e => setOn('admin')}
                                    t="1578818726239" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10112" width="64" height="64">
                                    <path d="M876.0576 769.024c5.12 34.816 34.82624 29.696 39.94624 45.056 0 9.71776-5.12 45.056-19.968 49.664-14.84288 0-34.816-5.12-49.664 0-9.71776 5.12-19.95776 9.72288-25.07776 19.96288-9.728 25.08288 9.71776 45.05088 0 54.77888-14.848 9.728-45.06112 25.088-54.784 14.848-14.84288-14.848-14.84288-34.82112-45.056-34.82112-39.94112 0-39.94112 39.94112-59.904 39.94112s-54.784-14.848-54.784-29.70112c5.12-19.96288 14.848-34.81088-5.12-54.77888-25.088-19.968-54.77888 0-65.01888-9.728-14.84288-9.728-19.96288-34.816-14.84288-49.65888s39.936-14.84288 39.936-54.78912c0-29.69088-34.816-34.81088-39.936-54.77376-5.12-14.848 5.12-39.94624 19.96288-45.06624 25.08288-9.71776 39.93088 9.728 65.01888-9.71776 14.848-14.83776 9.728-49.664 9.728-59.904 5.12-14.84288 25.07776-19.96288 39.936-19.96288 29.696 0 19.96288 34.82112 59.904 39.94112 39.936 0 34.816-14.848 54.77888-39.94112 25.08288 0 45.06112 9.72288 49.65888 19.96288 9.728 19.968-9.71776 49.664 19.968 69.63712 25.07776 14.84288 49.664-5.12 65.024 0 9.72288 5.12 14.84288 19.96288 19.96288 39.94112-9.72288 29.16352-54.78912 24.04352-49.66912 69.10976z m-179.70176-99.84c-119.80288 29.696-74.752 204.28288 39.936 184.832 115.2-25.09824 99.84-209.92-39.936-184.832z m-204.288-174.58688c-119.808 0-214.528-94.72-214.528-214.528s94.72-214.528 214.528-214.528c119.80288 0 214.52288 94.72 214.52288 214.528 0.00512 114.688-94.71488 214.528-214.52288 214.528z m174.592 49.65888s-79.88224 0-74.76224 54.784c5.12 59.904-74.752 14.83776-89.59488 65.024-19.968 59.89376 9.72288 49.65376 25.08288 89.6 9.728 25.08288-39.936 39.936-34.816 84.992 9.728 59.904 59.904 29.70624 74.75712 65.024 9.72288 29.696-25.08288 49.664-104.96 49.664-65.01888 0-189.44 0-234.496-5.12 0 0-129.536-5.12-129.536-89.6 0 0-5.12-124.928 74.752-214.528 0 0 84.992-109.56288 229.38112-109.56288l264.192 9.72288z" fill="#d81e06" p-id="10113"></path>
                                </svg>
                            </div>
                        )}
                    </AppContext.Consumer>
                </div>
            </div >
            {on == 'admin' && <AdminModal handleQuit={e => setOn('')} />}
        </React.Fragment >
    )
}

const AdminModal = ({ handleQuit }) => {
    const rootEl = useRef()
    const [key, setKey] = useState('users')
    useEffect(() => {
        const divs = $('.ad-tools > div', rootEl.current)
        divs.removeClass('active')
        for (let i = 0; i < divs.length; ++i) {
            if (divs[i].getAttribute('name') == key) {
                divs[i].classList.add('active')
                break
            }
        }
    }, [key])
    return (
        <div className='tb-adminmodal' ref={rootEl}>
            <div className='am-panel'>
                <div className='ad-tools'
                    onClick={e => {
                        const el = e.target
                        // todo verify el
                        setKey(el.getAttribute('name'))
                    }}>
                    <div name='users'>
                        <span>已注册用户</span>
                    </div>
                </div>
                <div className='ad-body'>
                    {key == 'users' && <AdminUsersTools />}
                </div>
                <div className='am-exit'
                    onClick={handleQuit}>
                    <svg t="1578835326262" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3951" width="64" height="64">
                        <path d="M86.016 0l-83.968 70.656c149.504 111.616 288.768 239.616 411.136 367.616-187.392 188.928-334.336 374.784-411.648 449.536l159.744 133.632c56.832-117.248 180.224-294.912 345.6-481.28 165.376 187.392 289.28 366.08 346.112 483.84 0 0 155.648-165.376 169.472-139.776C962.56 816.64 816.128 620.032 619.52 418.816c112.64-115.712 239.104-230.4 374.272-331.264l-36.864-68.608c-153.088 76.288-299.008 189.44-430.08 309.76-132.096-125.44-281.6-244.736-440.832-328.704z" p-id="3952" fill="#707070"></path>
                    </svg>
                </div>
            </div>
        </div>
    )
}
const AdminUsersTools = () => {
    const [data, setData] = useState()
    useEffect(() => {
        ajaxer.get('/admin/getUserList', {
            page_num: 1,
            page_size: 100
        }).then(res => setData(res))
        // todo lazy load
    }, [])
    return (
        data &&
        <Table name='已注册用户' data={data.list}
            export={null}>
            {['account', 'phone', 'email', 'institution', 'createTime'].map((v, i) => (
                <Column title={v} dataIndex={v} key={i}
                    sorter={(a, b) => b[v] - a[v]} />
            ))}
        </Table> ||
        <Loading />
    )
}
