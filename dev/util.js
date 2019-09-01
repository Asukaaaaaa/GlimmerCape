
const ClassNames = (...args) => args.reduce((acc, val, i) => val ? (acc += val + ' ') : acc, '')

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
import download from '../static/img/download-fill.svg'

const imgs = {
    logo, cross, test, detail, edit, mail, questionCircle, telephone, userCenter, download
}

export {
    ClassNames,
    BaseColor,
    NormalColor,
    ExtendColor,
    host,
    imgs
}