import React, { useState } from 'react'

import style from './toolbar.css'
import sticker from '../../../static/img/流汗.svg'
import { ClassNames } from '../../util'

export default function Toolbar() {
    const [active, setActive] = useState(false)
    return (
        <div className={style.main}>
            <img className={style.sticker} src={sticker}
                onClick={e => setActive(!active)} />
            <div className={ClassNames(style.menu, active && style.active)}>
                <div>
                    <a style={{ verticalAlign: '-webkit-baseline-middle' }}
                        href='/files/操作手册.docx'
                        download='操作手册.docx'>
                        操作手册</a>
                </div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}
