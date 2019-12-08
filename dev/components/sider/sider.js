import React from 'react'
import { withRouter } from 'react-router-dom'

import style from './sider.css'

import { ClassNames, imgs } from '../../utils'

const Sider = ({ active }) => {
    return (
        <div className={ClassNames(style.main, active && style.active)}>
            <div>
                <img src={imgs.test} />
                <span>View</span>
            </div>
            <div className={style.menu}>
                <div>
                    <img src={imgs.detail} />
                    <span>Detail</span>
                </div>
                <div>
                    <img src={imgs.edit} />
                    <span>Edit</span>
                </div>
            </div>
            <div className={style.menu}>
                <div>
                    <img src={imgs.questionCircle} />
                    <span>Question</span>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Sider)
