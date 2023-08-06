import './STYLING/Settings.scss'
import { TextField } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from './Context'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { api } from './Interceptors'

const ProfileSettings = () => {

    const { loginUser, userid } = useContext(UserContext)

    const [pro, setPro] = useState({
        fullname: '',
        gender: '',
        dob: '',
        status: '',
        country: '',
    })

    const handleInfo = (e) => {
        const name = e.target.name
        const value = e.target.value
        setPro({ ...pro, [name]: value })
    }

    const [about, setAbout] = useState('')
    const [ppic, setPpic] = useState('')

    const [nameToggle, setNameToggle] = useState(true)
    const nameRef = useRef(null)

    useEffect(() => {
        setPro({
            fullname: loginUser?.fullname || '',
            gender: loginUser?.gender || '',
            dob: loginUser?.dob || '',
            status: loginUser?.status || '',
            country: loginUser?.country || '',
        })
        setAbout(loginUser?.about || '')
        // setPpic(`http://localhost:3000/public/${loginUser?.profilepic}` || '')
    }, [loginUser])

    const changeBio = (e) => {
        e.preventDefault()

        setNameToggle(true);
        nameRef.current.innerHTML = "Edit";

        api.put('http://localhost:3000/change-bio', { ...pro, userid })
            .then((res) => {
                const data = res.data
                console.log('changeBio', data)

                setPro({
                    fullname: data?.fullname,
                    gender: data?.gender,
                    dob: data?.dob,
                    status: data?.status,
                    country: data?.country,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const changeAbout = () => {
        if (about) {
            api.put('http://localhost:3000/change-aboutme', { about, userid })
                .then((res) => {
                    console.log('changeAbout', res.data.about)

                    setAbout(res.data.about)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const changePic = (e) => {
        e.preventDefault()

        if (ppic) {

            const formData = new FormData();

            formData.append('file', ppic);

            api.put('http://localhost:3000/change-profilePic', formData)
                .then((res) => {
                    // setPpic(`http://localhost:3000/public/data`)
                    setPpic('')
                    console.log('changePic', res.data)
                }).catch((err) => {
                    console.log(err)
                })
        }
    }

    const picRef = useRef()
    const formRef = useRef()

    const handlepic = (e) => {
        // formRef.current.submit();
        picRef.current.src = URL.createObjectURL(e.target.files[0]);
        picRef.current.onload = function () {
            URL.revokeObjectURL(picRef.current.src) // free memory
        }
        setPpic(e.target.files[0])
    }

    if (Object.keys(loginUser).length) {
        return (
            <div className='mainS'>

                <div className='mainS1'>

                    <form onSubmit={changePic} ref={formRef} accept="image/*" encType="multipart/form-data">

                        <img ref={picRef} src={loginUser?.profilepic ? `http://localhost:3000/public/${loginUser?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'} />

                        <label><AddPhotoAlternateIcon style={{ background: 'black', color: 'white' }} />
                            <input type='file' onChange={handlepic} style={{ display: 'none' }} />
                        </label>

                        {ppic && <button type='submit'>Change</button>}

                    </form>

                    <div className='main1'>
                        <button className='ibt' ref={nameRef} onClick={nameToggle ? () => { setNameToggle(false); nameRef.current.innerHTML = "Done" } : changeBio}>Edit</button>

                        <form onSubmit={changeBio}>
                            <TextField label="Full Name" size="small" variant="standard" type='text' name='fullname' value={pro.fullname} onChange={handleInfo} InputProps={{ readOnly: nameToggle, }} focused />
                            <TextField label="Gender" size="small" variant="standard" type='text' name='gender' value={pro.gender} onChange={handleInfo} InputProps={{ readOnly: nameToggle, }} focused />
                            <TextField label="Date of Birth" size="small" variant="standard" type='text' name='dob' value={pro.dob} onChange={handleInfo} InputProps={{ readOnly: nameToggle, }} focused />
                            <TextField label="Relationship Status" size="small" variant="standard" type='text' name='status' value={pro.status} onChange={handleInfo} InputProps={{ readOnly: nameToggle, }} focused />
                            <TextField label="Country" size="small" variant="standard" type='text' name='country' value={pro.country} onChange={handleInfo} InputProps={{ readOnly: nameToggle, }} focused />
                        </form>
                    </div>
                </div>

                <div className='mainS2'>
                    <TextField
                        style={{ width: '100%' }}
                        label="About Me"
                        variant="outlined"
                        type='text'
                        focused
                        multiline
                        rows={5}
                        onChange={(e) => setAbout(e.target.value)}
                        value={about}
                    />
                    <button className='ibt' onClick={changeAbout}>Edit</button>
                </div>
            </div>
        )
    } else return null
}

export default ProfileSettings