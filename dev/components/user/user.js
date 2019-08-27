import React from 'react'
import { withRouter } from 'react-router-dom'

import style from './user.css'


const User = ({ active }) => {
    return (
        <div style={{ opacity: active ? 1 : 0, zIndex: active ? 998 : '' }} className={style.main}>
            <div className={style.info}>
                <div>
                    <div>
                        <img src='./img/mail-fill.svg' />
                        <span>email</span>
                    </div>
                    <div>
                        <img src='./img/telephone-fill.svg' />
                        <span>telephone</span>
                    </div>
                </div>
                <div>
                    name
                </div>
            </div>
            <div className={style.navi}>
                <div>
                    <img src='./img/user-center.svg' />
                    <span>个人中心</span>
                </div>
            </div>
        </div>
    )
}

export default User
