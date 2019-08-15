import React from 'react'

import style from './ani-border.css'

import { ClassNames } from '../../util'


export default props => {
    return (
        <div className={ClassNames(style.main, props.active ? style.active : style.inactive)}>
            {props.children}
        </div>
    )
}
