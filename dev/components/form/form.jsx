import * as React from 'react'
//
import { ClassNames } from '../../utils'
//styles
import './form.less'

const FormContext = React.createContext()

export class Form extends React.PureComponent {
  constructor(props) {
    super(props)
    const formValues = props.children.reduce((acc, v) => {
      acc[v.props.name] = null
      return acc
    }, {})
    this.state = {
      formValues,
      verify: false,
      setState: this.setState.bind(this)
    }
  }
  static getDerivedStateFromProps(props, state) {
    //verify
    state.verify = true
    for (let key in state.formValues) {
      if (state.verify &&
        state.formValues[key])
        state.verify = true
      else
        state.verify = false
    }
    //todo
    return state
  }
  handleSubmit = e => {
    this.props.handleSubmit(this.state.formValues)
  }
  render() {
    const { props, state } = this
    return (
      <div>
        <form className='cp-form'>
          <FormContext.Provider value={state}>
            {props.children}
            <Button label={props.submit} active={state.verify} onclick={this.handleSubmit} />
          </FormContext.Provider>
        </form>
      </div>
    )
  }
}

export { InputWrapper as Input }
const InputWrapper = props => (
  <FormContext.Consumer>
    {(ctx) => <Input {...props} {...ctx} />}
  </FormContext.Consumer>
)
const Input = ({
  placeholder, name, type,
  accept, baseFiles = [], value = '',
  formValues, setState
}) => {
  const [active, setActive] = React.useState(false)
  const [refs, setRefs] = React.useState({})
  switch (type) {
    case 'file':
      const [files, setFiles] = React.useState(baseFiles)
      const [select, setSelect] = React.useState(0)
      React.useEffect(() => {
        setRefs({
          input: React.createRef(),
          scroll: React.createRef(),
        })
      }, [])
      React.useEffect(() => {
        if (files.length === 1) {
          setSelect(0)
          formValues[name] = files[0]
          setState({ formValues })
        }
      }, [files])
      return (
        <div className='cp-input-file'>
          <input type='file' accept={accept} ref={refs.input} multiple
            onChange={e => {
              const efiles = Array.from(e.target.files)
              const infile = efiles.map(f => {
                f.img = window.URL.createObjectURL(f)
                return f
              })
              setFiles(files.concat(infile))
            }} />
          <div className='if-selector'
            onClick={e => refs.input.current.click()}>
            <svg t="1575729819099" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3814" width="200" height="200">
              <path d="M863.328262 481.340895l-317.344013 0.099772L545.984249 162.816826c0-17.664722-14.336138-32.00086-32.00086-32.00086s-31.99914 14.336138-31.99914 32.00086l0 318.400215-322.368714-0.17718c-0.032684 0-0.063647 0-0.096331 0-17.632039 0-31.935493 14.239806-32.00086 31.904529-0.096331 17.664722 14.208843 32.031824 31.871845 32.095471l322.59234 0.17718 0 319.167424c0 17.695686 14.336138 32.00086 31.99914 32.00086s32.00086-14.303454 32.00086-32.00086L545.982529 545.440667l317.087703-0.099772c0.063647 0 0.096331 0 0.127295 0 17.632039 0 31.935493-14.239806 32.00086-31.904529S880.960301 481.404542 863.328262 481.340895z" p-id="3815" fill="#cdcdcd"></path>
            </svg>
            <span>上传文件</span>
          </div>
          <div className='if-preview'>
            <div ref={refs.scroll}
              onWheel={e => {
                const scroll = refs.scroll.current
                scroll.scrollLeft = scroll.scrollLeft + e.deltaY / 10
              }}>
              {files.map((f, i) => (
                <div key={i} className={ClassNames(i == select && 'selected')}
                  onClick={e => {
                    setSelect(i)
                    formValues[name] = files[i]
                    setState({ formValues })
                  }}>
                  <img src={f.img} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    default:
      React.useEffect(() => {
        value && setActive(true)
        formValues[name] = value
        setState({ formValues })
      }, [value])
      return (
        <div className={ClassNames('cp-input', active && 'active')}>
          <label>
            <span>{placeholder}</span>
            <input type={type} ref={refs.input} defaultValue={value}
              onChange={e => {
                const v = e.target.value
                Boolean(v) !== active && setActive(!active)
                if (v !== formValues[name]) {
                  formValues[name] = v
                  setState({ formValues })
                }
              }} />
          </label>
        </div>
      )
  }
}

export const Button = ({
  label = '提交',
  active = true,
  onclick
}) => {
  return (
    <div className={ClassNames('cp-button', active && 'active')}>
      <button onClick={onclick}>{label}</button>
    </div>
  )
}

export const Divider = ({
  label = '或'
}) => {
  return (
    <div className='cp-divider'>
      <div className='divider-line' />
      {label &&
        <div className='divider-label'>{label}</div>}
      <div className='divider-line' />
    </div>
  )
}

export default Form
