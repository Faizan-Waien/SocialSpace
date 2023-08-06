import './STYLING/Settings.scss'
import { TextField } from '@mui/material'
import { useContext, useState } from 'react'
import { UserContext } from './Context'
import { api } from './Interceptors'

const PrivacySettings = () => {

    const { loginUser, userid } = useContext(UserContext)

    const [message, setMessage] = useState({})

    const [passChange, setPassChange] = useState({
        current: '',
        latest: '',
        retype: '',
    })

    const handle = (e) => {
        const name = e.target.name
        const value = e.target.value
        setPassChange({ ...passChange, [name]: value })
    }

    const changePassword = (e) => {
        e.preventDefault()
        if (passChange.latest === passChange.retype) {

            api.put('http://localhost:3000/change-password', { ...passChange, userid })
                .then(res => {
                    console.log(res.data)

                    setMessage(res.data)
                    setTimeout(() => setMessage({}), 5000)
                })
                .catch((err) => {
                    console.log(err.response.data)
                    setMessage(err.response.data)
                    setTimeout(() => setMessage({}), 5000)
                })
        } else {
            setMessage({ ...message, retry: 'New password did not match' })
            setTimeout(() => setMessage({}), 5000)
        }
    }

    if (Object.keys(loginUser).length) {
        return (

            <div className='PriSet'>

                <div className='pri1'>
                    <h3>Login Information</h3>
                    <TextField label="UserName" size="small" variant="standard" type='text' value={loginUser.username || ''} InputProps={{ readOnly: true, }} focused />
                    <TextField label="Email Address" size="small" variant="standard" type='email' value={loginUser.email || ''} InputProps={{ readOnly: true, }} focused />
                </div>

                <div className='pri1'>

                    <h3>Change password</h3>

                    <form onSubmit={changePassword}>
                        <TextField label="Current Password" size="small" variant="outlined" type='password' value={passChange.current} name='current' id='current' onChange={handle} required />
                        <TextField label="New Password" size="small" variant="outlined" type='password' value={passChange.latest} name='latest' id='latest' onChange={handle} required />
                        <TextField label="Confirm New Password" size="small" variant="outlined" type='password' value={passChange.retype} name='retype' id='retype' onChange={handle} required
                            helperText={message && message.retry || message.failed} />

                        {message && <h5>{message.success}</h5>}

                        <button type='submit'>Save Changes</button>
                    </form>

                </div>

            </div>
        )
    } else return null
}
export default PrivacySettings