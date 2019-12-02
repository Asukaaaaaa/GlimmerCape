
const debounce = (f, time = 200) => {
    let handle
    return (...args) => {
        handle &&
            clearTimeout(handle) ||
            (handle = setTimeout(() => f(...args), time))
    }
}
const throttle = (f, time) => {
    let last
    return (...args) => {
        let now = new Date().getTime()
        if (now - last > time || !last) {
            last = now
            f(...args)
        }
    }
}

const download = (function () {
    const a = document.createElement('a')
    document.body.appendChild(a)
    return (url, name) => {
        a.href = url
        a.download = name
        a.click()
    }
})()

const num2e = (num, len = 4) => {
    const p = Math.floor(Math.log10(num))
    const n = (num * Math.pow(10, -p)).toFixed(len)
    return n + 'e' + p;
}

const _ = {
    debounce,
    throttle,
    download,
    num2e
}

const ClassNames = (...args) => args.reduce((acc, val, i) => acc + (val || '') + ' ', '')

const BaseColor = ['#60acfc', '#32d3eb', '#5bc49f', '#feb64d', '#ff7c7c', '#9287e7']
const color = []
const NormalColor = [
    '#60acfc', '#27a1ea', '#39b3ea', '#35c5ea',
    '#32d3eb', '#4ebecd', '#40cec7', '#63d5b2',
    '#5bc49f', '#9cdc82', '#d4ec59', '#ffda43',
    '#feb64d', '#ff9f69', '#fa816d', '#fb6e6c',
    '#ff7c7c', '#e9668e', '#d660a8', '#b55cbd',
    '#9287e7', '#747be1', '#6370de', '#668ed6',
]
const ExtendColor = []

const host = 'https://www.cross2u.top/Web_NEview'

import logo from '../static/img/logo.png'
import cross from '../static/img/cross.png'
import test from '../static/img/test.png'
import detail from '../static/img/detail.svg'
import edit from '../static/img/edit.svg'
import mail from '../static/img/mail.svg'
import questionCircle from '../static/img/question-circle.svg'
import telephone from '../static/img/telephone.svg'
import userCenter from '../static/img/user-center.svg'
import downloadSvg from '../static/img/download-fill.svg'
import exchangeSvg from '../static/img/exchange.svg'
import { isNumber } from 'util'

const imgs = {
    logo, cross, test, detail, edit, mail, questionCircle, telephone, userCenter, downloadSvg, exchangeSvg
}

export {
    _,
    ClassNames,
    BaseColor,
    NormalColor,
    ExtendColor,
    host,
    imgs
}