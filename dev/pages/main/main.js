import React from 'react'

import Player from '../../components/player/player'

import style from './main.styl'

export default class Main extends React.Component {
    render() {
        return (
            <div className={style.main}>
                <h1>Hello Again!</h1>
                <Player></Player>
            </div>
        )
    }
}
