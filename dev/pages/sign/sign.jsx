import * as React from 'react'
// 
import { AppContext } from '../../app'
import { Form, Input, Divider } from '../../components/form/form'
import { ClassNames, fetcher, ajaxer, resolveLocalPath, _HOST } from '../../utils'
//styles
import './sign.less'


const SignWrapper = props => (
  <AppContext.Consumer>
    {ctx => <Sign {...ctx} {...props} />}
  </AppContext.Consumer>
)
const Sign = ({
  user, setUser,
}) => {
  const [mode, setMode] = React.useState('in')
  const [bingBg, setBingBg] = React.useState({})
  const [uinfo, setUinfo] = React.useState({})
  React.useEffect(() => {
    //获取bing壁纸
    fetch(_HOST + '/BingBg')
      .then(r => r.json())
      .then(res => setBingBg(res))

    //本地登录信息
    let user = localStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      if (user.signed) {
        setUser(user)
      } else {
        setUinfo(user)
      }
    }
  }, [])
  return (
    <div className='pg-signin'
      style={{
        //background: `center / contain no-repeat url("${bingBg.img}")`
      }}>
      <div className='sign-table'>
        <div className={ClassNames('st-container', mode == 'up' && 'signup')}>
          <div className='st-signin'>
            <div className='st-title'></div>
            {uinfo.photo ?
              <div className='st-uinfo'>
                <span>点击头像快捷登录</span>
                <div onClick={e => {
                  setUser(uinfo)
                }}>
                  <img src={uinfo.photo} />
                </div>
                <span>{uinfo.account}</span>
              </div> :
              <React.Fragment>
                <Form submit='登录'
                  handleSubmit={values => {
                    ajaxer.post('/user/login', values)
                      .then(res => {
                        ajaxer.post('/user/getUserInfo', { user_id: res })
                          .then(uinfo => {
                            uinfo.photo = resolveLocalPath(uinfo.photo)
                            localStorage.setItem('user', JSON.stringify(uinfo))
                            setUser(uinfo)
                          })
                      })
                  }}>
                  <Input placeholder='账号' name='account' value={uinfo.account} />
                  <Input placeholder='密码' name='password' type='password' value={uinfo.password} />
                </Form>
              </React.Fragment>}
            <Divider />
            <div className='st-switch'>
              <p>
                没有账号?
                <span onClick={e => setMode('up')}>注册</span>
              </p>
            </div>
          </div>
          <div className='st-signup'>
            <div className='st-title'></div>
            <Form submit='注册'
              handleSubmit={values => {
                const data = new FormData()
                Object.keys(values).forEach(k => data.set(k, values[k]))
                ajaxer.post('/user/signUp', data)
                  .then(res => {
                    setUinfo({
                      account: values['user.account'],
                      password: values['user.password']
                    })
                    setMode('in')
                  })
              }}>
              <Input placeholder='账号' name='user.account' />
              <Input placeholder='密码' name='user.password' type='password' />
              <Input placeholder='手机号' name='user.phone' />
              <Input placeholder='头像' name='photo' type='file' accept='image/*'
                /*baseFiles={[{
                  img: '/static/imgs/icon.png'
                }]}*/ />
            </Form>
            <Divider />
            <div className='st-switch'>
              <p>
                已有账号?
                <span onClick={e => setMode('in')}>登录</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignWrapper

