
const ClassNames = (...args) => args.reduce((acc, val, i) => val ? (acc += val + ' ') : acc, '')

export {
    ClassNames
}