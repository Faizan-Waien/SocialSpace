import { useContext, useEffect, useRef, useState } from "react"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNavigate } from "react-router-dom";
import { FriendshipContext } from "./FriendsContext";
import { api } from "./Interceptors";

const ProfileBanner = ({ profileid, userid }) => {

    const { f_follow, f_notify, friends, n_del2 } = useContext(FriendshipContext)

    const [pUser, setPUser] = useState([])
    const [pBanner, setPBanner] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        fetchProfileuser()
    }, [profileid, userid])

    const fetchProfileuser = () => {
        if (userid && profileid) {
            api.get(`http://localhost:3000/profileuser/${profileid}/${userid}`)
                .then((res) => {
                    setPUser(res.data)
                    // console.log(res.data)
                }).catch((err) => {
                    console.log(err)
                })
        }
    }

    const changeBanner = (e) => {
        e.preventDefault()

        if (pBanner) {

            const formData = new FormData();

            formData.append('file', pBanner);

            api.put('http://localhost:3000/change-profileBanner', formData)
                .then((res) => {
                    // setPBanner(`http://localhost:3000/public/data`)
                    setPBanner('')
                    // console.log(res.data)
                }).catch((err) => {
                    console.log(err)
                })
        }
    }

    const bannerRef = useRef()

    const handleBanner = (e) => {
        bannerRef.current.src = URL.createObjectURL(e.target.files[0]);
        bannerRef.current.onload = function () {
            URL.revokeObjectURL(bannerRef.current.src) // free memory
        }
        setPBanner(e.target.files[0])
    }

    return (

        <div className='probar'>

            {pUser?.map((p) => {
                return (
                    <div key={p.id}>

                        <div className='pb0'>

                            <form onSubmit={changeBanner} accept="image/*" encType="multipart/form-data">

                                <img className='pban' ref={bannerRef} src={p?.profilebanner ? `http://localhost:3000/public/${p?.profilebanner}` : 'http://localhost:3000/public/profile-banners/banner.jpg'} />

                                {p.id === userid &&
                                    <div>
                                        <label><AddPhotoAlternateIcon style={{ background: 'black', color: 'white' }} />
                                            <input type='file' onChange={handleBanner} style={{ display: 'none' }} />
                                        </label>

                                        {pBanner && <button type='submit'>Change</button>}
                                    </div>
                                }

                            </form>
                        </div>

                        <div className='pb1'>

                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img onClick={() => window.open(`http://localhost:3000/public/${p?.profilepic}`, '_blank')} style={{ cursor: "pointer" }}
                                    src={p?.profilepic ? `http://localhost:3000/public/${p?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'} />

                                <h1>{p?.fullname}</h1>

                                {p.id !== userid &&

                                    (friends.find((item) => item.id === p.id) ? (
                                        <button className='followbtn'>Following</button>
                                    ) : (
                                        <button className='followbtn' onClick={() => { f_follow(p?.id); f_notify(p?.id); n_del2(p?.id) }}>
                                            {p?.followed.find((item) => item.id_friend == userid) ? <span>Follow Back</span> : <span>Follow</span>}
                                        </button>))
                                }
                                <div style={{ display: "flex", gap: 20 }}>

                                    <div className="dpd">
                                        <span><b>Followers</b> ({p?.followers.length})</span>

                                        <div className="dpd1">
                                            {p?.followers.map((i) => {
                                                return (
                                                    <div key={i?.f_id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 5, borderBottom: '1px solid grey' }}>
                                                        <img src={i?.profilepic ? `http://localhost:3000/public/${i?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'} style={{ width: 30, height: 30 }} />
                                                        <span><b>{i?.fullname}</b></span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="dpd">
                                        <span><b>Followed</b> ({p?.followed.length})</span>

                                        <div className="dpd1">
                                            {p?.followed.map((i) => {
                                                return (
                                                    <div key={i?.f_id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 5, borderBottom: '1px solid grey' }}>
                                                        <img src={i?.profilepic ? `http://localhost:3000/public/${i?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'} style={{ width: 30, height: 30 }} />
                                                        <span><b>{i?.fullname}</b></span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pb2">

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3 style={{ margin: 0 }}>About</h3>

                                    {p.id === userid &&
                                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/settings')}>Edit</span>
                                    }
                                </div>

                                <span style={{ height: 100, padding: '5px 5px', boxShadow: 'black 0px 0px 10px 0px' }}> {p?.about} </span>

                                <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>

                                    <div style={{ display: 'flex', flexDirection: 'column', flex: '50%' }}>
                                        <span><b>Relationship Status:</b> {p?.status}</span>
                                        <span><b>Gender:</b> <span>{p?.gender}</span></span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', flex: '50%' }}>
                                        <span><b>Date of Birth:</b> <span>{p?.dob}</span></span>
                                        <span><b>Country:</b> {p?.country}</span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                )
            })
            }
        </div>

    )
}

export default ProfileBanner