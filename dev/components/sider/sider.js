import React from 'react'
import { withRouter } from 'react-router-dom'

import style from './sider.css'

import { ClassNames } from '../../util'

const Sider = ({ active }) => {
    return (
        <div className={ClassNames(style.main, active && style.active)}>
            <div>
                <img src='./img/test.png' />
                <span>View</span>
            </div>
            <div className={style.menu}>
                <div>
                    <img src='./img/detail.svg' />
                    <span>Detail</span>
                </div>
                <div>
                    <img src='./img/edit.svg' />
                    <span>Edit</span>
                </div>
            </div>
            <div className={style.menu}>
                <div>
                    <img src='./img/question-circle.svg' />
                    <span>Question</span>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Sider)
