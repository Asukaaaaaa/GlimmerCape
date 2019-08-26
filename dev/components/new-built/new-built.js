import React from 'react'

import style from './new-built.css'

const NewBuilt = ({ }) => {
    return (
        <div className={style.main}>
            <div className={style.title}>
                <span>创建新项目</span>
            </div>
            <div className={style.blocks}>
                <div>
                    <img src='./img/cross.png' />
                </div>
            </div>
        </div>
    )
}

export default NewBuilt
