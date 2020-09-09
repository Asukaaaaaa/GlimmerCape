import React from 'react'

import style from './player.css'


export default class Player extends React.Component {
    constructor(props) {
        super(props)

        const mediaSource = new MediaSource()
        mediaSource.onsourceopen = () => {
            URL.revokeObjectURL(mediaSource)
            this.sourceBuffer = mediaSource.addSourceBuffer('video/mp4;codecs="avc1.64001f, mp4a.40.2";')
            const src = ['./media/01/', './media/02/', './media/03/']
            const f = () => {
                src.length && this.play(src.shift())
                    .then(f)
            }
            f()
        }
        this.xmlParser = new DOMParser()

        this.state = {
            vdoSource: URL.createObjectURL(mediaSource)
        }
    }

    componentDidMount() {
        //
    }

    play(dir) {
        const { sourceBuffer, xmlParser } = this,
            vdo = this.refs.vdo
        return new Promise((resolve, reject) => {
            Promise.all([
                fetch(dir + 'init.mp4')
                    .then(res => res.arrayBuffer()),
                fetch(dir + 'dash.mpd')
                    .then(res => res.text())
                    .then(xml => {
                        const info = xmlParser.parseFromString(xml, 'text/xml'),
                            duration = info.getElementsByTagName('Period')[0]
                                .getAttribute('duration'),
                            represt = info.getElementsByTagName('Representation')[0],
                            mime = `video/mp4;codecs="${represt.getAttribute('codecs')}";`,
                            last = +represt.querySelector('SegmentList > SegmentURL:last-of-type')
                                .getAttribute('media').split('.')[1].slice(1)
                        return { mime, last }
                    })
            ]).then(([initBuffer, { mime, last }]) => {
                sourceBuffer.appendBuffer(initBuffer)
                vdo.currentTime = 0
                const medias = []
                medias.records = new Set()
                for (let i = 0; i++ < last;)
                    medias.records.add(i)
                let downer, loader
                // play control
                vdo.i = 0
                const vdoTimeUpdate = () => {
                    // TODO vdo.i dont match downer.i, duration of each piece of media is different
                    vdo.i = Math.floor(vdo.currentTime / 5)
                    downer.i - vdo.i < 2 && downer.down()
                    let ended = false
                    vdo.duration - vdo.currentTime < 10 && (vdo.ontimeupdate = e => {
                        if (vdo.duration - vdo.currentTime < 0.5 && !ended) {
                            ended = true
                            vdo.ontimeupdate = null
                            sourceBuffer.remove(0, Infinity)
                            resolve()
                        }
                    })
                }
                vdo.play()
                    .then(_ => {
                        vdo.muted = false
                        setInterval(vdoTimeUpdate, 5000)
                    })
                vdo.onseeking = vdoTimeUpdate
                // vdo.onended = // cant do endOfStream(), no ended

                // down & load
                downer = new function () {
                    this.times = 0
                    this.history = []
                    this.do = i => {
                        fetch(dir + i + '.m4s')
                            .then(res => res.arrayBuffer())
                            .then(buffer => {
                                medias.push({ i, buffer })
                                loader.keep()
                            })
                    }
                    this.i = 0
                    this.down = i => {
                        while (this.i < last && this.i - vdo.i < 10)
                            this.do(++this.i)
                    }
                }()
                loader = new function () {
                    this.times = 0
                    this.do = () => {
                        if (medias.length && this.times && !sourceBuffer.updating) {
                            this.times--
                            const media = medias.shift()
                            sourceBuffer.appendBuffer(media.buffer)
                            medias.records.delete(media.i)
                        }
                    }
                    sourceBuffer.onupdateend = this.do
                    this.keep = () => {
                        this.times++
                        sourceBuffer.updating || this.do()
                    }
                }()
                downer.down()
            })
        })
    }

    render() {
        const { props, state } = this
        return (
            <div id={props.position} className={style.main} onClick={() => props.handleSetActive('player')}>
                <video ref='vdo' src={this.state.vdoSource} controls muted></video>
            </div>
        )
    }
}