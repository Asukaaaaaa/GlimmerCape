import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import style from './header.css'

import { ClassNames, imgs } from '../../utils'
import { AppContext } from '../../app'

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userOn: false
        }
    }

    render() {
        const { state, props } = this
        return (
            <AppContext.Consumer>
                {({ user = {} }) => (
                    <div className={style.main}>
                        <div>
                            <svg className={style.hoverable} onClick={props.handleClickTab} viewBox="0 0 24 24">
                                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                            </svg>
                            <img src={imgs.logo} onClick={e => this.props.history.push('/')} />
                        </div>
                        <div className={ClassNames(style.hoverable, state.userOn && style['user-on'])}
                            onClick={e => {
                                props.handleClickUser(!state.userOn)
                                this.setState({ userOn: !state.userOn })
                            }}>
                            <img src={user.photo || imgs.test} />
                        </div>
                    </div>
                )}
            </AppContext.Consumer>
        )
    }
}

export default withRouter(Header)
