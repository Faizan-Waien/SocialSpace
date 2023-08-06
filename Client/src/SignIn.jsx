import { TextField } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SignIn = () => {

  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    username: '',
    password: '',
  })

  const [message, setMessage] = useState('')

  const handleInputs = (e) => {
    const name = e.target.name
    const value = e.target.value
    setUserData({ ...userData, [name]: value })
  }

  const login = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3000/signin',userData, 
    // {headers: {'Content-Type': 'application/json'}}
      )
      .then((res) => {
        const { token, refreshToken } = res.data
   
        if (token) {
          navigate('/home')
        }
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
      })
      .catch(err => {
        console.log(err)
          setMessage(err.response.data)
          setTimeout(() => {setMessage('')}, 5000);
      })

    setUserData({
      username: '',
      password: '',
    })
  }

  return (
    <div className='bg'>

      <div className='formbox'>

        <div className='hd'><h1>SocialSpace</h1></div>

        <form onSubmit={login}>

          <h2>SignIn</h2>

          <TextField className='field' label="Username" variant="outlined" type='text' onChange={handleInputs} value={userData.username} id='username' name='username' color='secondary' required />

          <TextField className='field' label="Password" variant="outlined" type='password' onChange={handleInputs} value={userData.password} id='password' name='password' color='secondary' required 
          helperText={message && message}/>

          <button className='cardbutton' type='submit'>SignIn</button>

        </form>

        <div className='sip'>
          <label>New to SocialSpace?</label>
          <a onClick={() => navigate('/signup')}>SignUp now.</a>
        </div>
      </div>
    </div>
  )
}
export default SignIn