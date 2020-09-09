import * as React from 'react'
// 
import { AppContext } from '../../app'
import { Form, Input, Divider } from '../../components/form/form'
import { ClassNames, fetcher, ajaxer, resolveLocalPath, _HOST } from '../../utils'
//styles
import './sign.less'
import { message } from 'antd'


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
  const [signinMode, setSigninMode] = React.useState('user')
  const [focus, setFocus] = React.useState()
  React.useEffect(() => {
    //获取bing壁纸
    //fetch(_HOST + '/BingBg')
    //  .then(r => r.json())
    //  .then(res => setBingBg(res))

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
    if (!localStorage.getItem('signed')) {
      localStorage.setItem('signed', true)
      //前往引导页
      window.location.replace('/guide/intro.html')
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
            <div className='st-title' />
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
              <div className='st-form'>
                <div className='sign-mode'>
                  <div className={signinMode == 'user' ? 'active' : ''}
                    onClick={e => setSigninMode('user')}>
                    用户
                  </div>
                  <div className={signinMode == 'admin' ? 'active' : ''}
                    onClick={e => setSigninMode('admin')}>
                    管理员
                  </div>
                </div>
                <Form submit='登录'
                  handleSubmit={values => {
                    if (signinMode == 'user')
                      ajaxer.post('/user/login', values)
                        .then(res => {
                          ajaxer.post('/user/getUserInfo', { user_id: res })
                            .then(uinfo => {
                              message.success('登录成功.', 1)
                              uinfo.photo = resolveLocalPath(uinfo.photo)
                              localStorage.setItem('user', JSON.stringify(uinfo))
                              setUser(uinfo)
                            })
                        }).catch(e => {
                          message.error(e.resultDesc, 1.5)
                        })
                    else if (signinMode == 'admin')
                      ajaxer.post('/admin/login', values)
                        .then(r => {
                          message.success('登录成功.', 1)
                          const uinfo = {
                            account: values.account,
                            isAdmin: true
                          }
                          setUser(uinfo)
                        }).catch(e => {
                          message.error(e.resultDesc, 1.5)
                        })
                  }}>
                  <Input placeholder='账号' name='account' value={uinfo.account} />
                  <Input placeholder='密码' name='password' type='password' value={uinfo.password} />
                </Form>
              </div>}
            <Divider />
            <div className='st-switch'>
              {uinfo.photo &&
                <p>
                  <span onClick={e => setUinfo({})}>使用其他账号</span>
                </p> ||
                <p>
                  如何操作？
                <span onClick={e => window.location.replace('/guide/intro.html')}>引导</span>
                </p>}
              <p>
                没有账号？
                <span onClick={e => setMode('up')}>注册</span>
              </p>
            </div>
          </div>
          <div className='st-signup'>
            <div className='st-title'></div>
            <Form submit='注册'
              onFocus={e => setFocus(e)}
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
              <Input placeholder='姓名' name='user.name' />
              <Input placeholder='手机号' name='user.phone' fneed={true} />
              <Input placeholder='邮箱' name='user.e_mail' />
              <div className='form-item'>
                {/*focus == 'user.institution' &&
                  <div className='fi-selects'>
                    机构
                </div>*/}
                <Input placeholder='机构' name='user.institution' />
              </div>
              <Input placeholder='头像' name='photo' type='file' accept='image/*' fneed={true}
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
    </div >
  )
}

export default SignWrapper

