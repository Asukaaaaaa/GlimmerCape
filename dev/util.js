
const ClassNames = (...args) => args.reduce((acc, val, i) => val ? (acc += val + ' ') : acc, '')

const BaseColor = ['#60acfc', '#32d3eb', '#5bc49f', '#feb64d', '#ff7c7c', '#9287e7']
const color = []//BaseColor.reduce()
const NormalColor = []
const ExtendColor = []

const host = 'http://www.zueler.cn:8080/Web_NEview'

export {
    ClassNames,
    BaseColor,
    NormalColor,
    ExtendColor,
    host
}