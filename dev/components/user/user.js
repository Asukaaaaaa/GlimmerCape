import React from 'react'
import { withRouter } from 'react-router-dom'

import { AppContext } from '../../app'
import style from './user.css'
import { imgs } from '../../utils'


const User = ({ active }) => {
    return (
        <AppContext.Consumer>
            {({ user = {} }) => (
                <div style={{ opacity: active ? 1 : 0, zIndex: active ? 998 : '' }} className={style.main}>
                    <div className={style.info}>
                        <div>
                            <div>
                                <img src={imgs.mail} />
                                <span>{user.email || 'email'}</span>
                            </div>
                            <div>
                                <img src={imgs.telephone} />
                                <span>{user.phone}</span>
                            </div>
                        </div>
                        <div>{user.account}</div>
                    </div>
                    <div className={style.navi}>
                        <div>
                            <img src={imgs.userCenter} />
                            <span>个人中心</span>
                        </div>
                    </div>
                </div>
            )}
        </AppContext.Consumer>
    )
}

export default User
