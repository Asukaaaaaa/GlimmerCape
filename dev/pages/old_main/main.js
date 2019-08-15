import React from 'react'

import Player from '../../components/player/player'
import Comic from '../../components/comic/comic'
import AniBorder from '../../components/ani-border/ani-border'
import { ClassNames } from '../../util'

import style from './main.css'


export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active: ''
        }
    }

    GetActive(props) {
        switch (props.active) {
            case 'comic':
                return <Comic />
            case 'player':
                return <Player />
            default:
                return null
        }
    }

    handleSetActive(active) {
        this.setState({ active })
    }

    render() {
        const { state, GetActive } = this
        return (
            <div className={style.main}>
                <GetActive active={state.active} />
                <div className={style.toolbar}>
                    <Comic position='toolbar-item' handleSetActive={this.handleSetActive.bind(this)} />
                    <Player position='toolbar-item' handleSetActive={this.handleSetActive.bind(this)} />
                </div>
            </div>
        )
    }
}
