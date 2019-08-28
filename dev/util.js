
const ClassNames = (...args) => args.reduce((acc, val, i) => val ? (acc += val + ' ') : acc, '')

const BaseColor = ['#60acfc', '#32d3eb', '#5bc49f', '#feb64d', '#ff7c7c', '#9287e7']
const color = []//BaseColor.reduce()
const NormalColor = []
const ExtendColor = []

const host = '/Web_NEview'//'http://www.zueler.cn:8080/Web_NEview'

import logo from '../static/img/logo.png'
import cross from '../static/img/cross.png'
import test from '../static/img/test.png'
import detail from '../static/img/detail.svg'
import edit from '../static/img/edit.svg'
import mail from '../static/img/mail.svg'
import questionCircle from '../static/img/question-circle.svg'
import telephone from '../static/img/telephone.svg'
import userCenter from '../static/img/user-center.svg'

const imgs = {
    logo, cross, test, detail, edit, mail, questionCircle, telephone, userCenter
}

export {
    ClassNames,
    BaseColor,
    NormalColor,
    ExtendColor,
    host,
    imgs
}