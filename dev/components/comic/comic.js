import React from 'react'

import { ClassNames } from '../../util.js'

import style from './comic.css'


export default class Comic extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        const { props, state } = this
        return (
            <div className={ClassNames(style.main)}>
                <div id={props.position} onClick={() => props.handleSetActive('comic')}>
                    <img src='/gantz/27/3.jpg'></img>
                    <img src='/gantz/27/2.jpg'></img>
                </div>
            </div>
        )
    }
}