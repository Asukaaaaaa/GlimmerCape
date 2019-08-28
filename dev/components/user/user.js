import React from 'react'
import { withRouter } from 'react-router-dom'

import style from './user.css'
import { imgs } from '../../util'


const User = ({ active }) => {
    return (
        <div style={{ opacity: active ? 1 : 0, zIndex: active ? 998 : '' }} className={style.main}>
            <div className={style.info}>
                <div>
                    <div>
                        <img src={imgs.mail} />
                        <span>email</span>
                    </div>
                    <div>
                        <img src={imgs.telephone} />
                        <span>telephone</span>
                    </div>
                </div>
                <div>name</div>
            </div>
            <div className={style.navi}>
                <div>
                    <img src={imgs.userCenter} />
                    <span>个人中心</span>
                </div>
            </div>
        </div>
    )
}

export default User
