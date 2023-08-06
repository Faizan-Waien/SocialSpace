import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField } from '@mui/material'
import GenderInput from './GenderInput'
import axios from 'axios'

const SignUp = () => {

  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmpassword: '',
    fullname: '',
    email: '',
    gender: '',
  })

  const [message, setMessage] = useState(null)

  const handleInputs = (e) => {
    const name = e.target.name
    const value = e.target.value
    setUserData({ ...userData, [name]: value })
  }

  const logout = (e) => {
    e.preventDefault()

    if (userData.password === userData.confirmpassword) {
      axios.post('http://localhost:3000/signup', userData)
        .then(res => {
          // if (res.status >= 400) {throw res}
          // return res.json()
          setMessage({ ...message, confirmation: 'E-mail is sent to your Email Adress verify and SignIn' })
          setTimeout(() => setMessage({}), 5000)
        })
        .catch(err => {
          // err.json().then(data => {})
          setMessage(err.response.data)
          setTimeout(() => setMessage({}), 5000)
        })
      setUserData({
        username: '',
        password: '',
        confirmpassword: '',
        fullname: '',
        email: '',
        gender: '',
      })

    } else {
      setMessage({ ...message, Cpassword: 'Password did not match' })
      setTimeout(() => setMessage([]), 5000)
    }
  }

  return (
    <div className='bg'>

      <div className='formbox'>

        <div className='hd'>
          <h1>SocialSpace</h1>
        </div>

        <form onSubmit={logout}>

          <h2>SignUp</h2>

          <div style={{ display: 'flex', gap: 20 }}>

            <TextField className='field' label="Full Name" variant="outlined" type='text' onChange={handleInputs} value={userData.fullname} id='fullname' name='fullname' color='secondary' required />

            <TextField className='field' label="Password" variant="outlined" type='password' onChange={handleInputs} value={userData.password} id='password' name='password' color='secondary' required
              helperText={message && message.password} />
          </div>

          <div style={{ display: 'flex', gap: 20 }}>

            <TextField className='field' label="Username" variant="outlined" type='text' onChange={handleInputs} value={userData.username} id='username' name='username' color='secondary' required
              helperText={message && message.username} />

            <TextField className='field' label="Confirm Password" variant="outlined" type='password' onChange={handleInputs} value={userData.confirmpassword} id='confirmpassword' name='confirmpassword' color='secondary' required
              helperText={message && message.Cpassword} />

          </div>

          <div style={{ display: 'flex', gap: 20 }}>

            <TextField className='field' label="Email Address" variant="outlined" type='text' onChange={handleInputs} value={userData.email} id='email' name='email' color='secondary' required
              helperText={message && message.email1} />

            <GenderInput gender={userData.gender} setUserData={setUserData} handleInputs={handleInputs} />

          </div>

          <button className='cardbutton' type='submit'>SignUp</button>

          <h5>{message && message.confirmation}</h5>

        </form>

        <div className='sip'>
          <label>Already Registered </label>
          <a onClick={() => navigate('/')} >SignIn now.</a>
        </div>
      </div>
    </div>
  )
}
export default SignUp