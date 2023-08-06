import './STYLING/Navbar.scss'
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GroupIcon from '@mui/icons-material/Group';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './Context';
import { useContext, useEffect, useState } from 'react';
import { Divider } from '@mui/material';
import { Badge } from '@mui/material';
import { FriendshipContext } from './FriendsContext';
import { socket } from './Chat';
import { api } from './Interceptors';

const Navbar = () => {

    const { userpic } = useContext(UserContext)
    const { f_follow, n_del, f_notify, notify, friends, userid } = useContext(FriendshipContext)

    const navigate = useNavigate()

    const [focus, setFocus] = useState(false)
    const [focus2, setFocus2] = useState(false)
    const [focus3, setFocus3] = useState(false)
    const [focus4, setFocus4] = useState(false)

    const [searchUser, setSearchUser] = useState([])
    const [searchText, setSearchText] = useState('')
    const [commentNotify, setCommentNotify] = useState([])

    useEffect(() => {
        socket.on('receive_notification', (data) => {
            setCommentNotify((st) => [data.alert, ...st])
            // console.log(data);
        })

        return () => {
            socket.off('receive_notification');
        }
    }, [socket])

    const fetchSearch = () => {
        if (searchText || searchText.trim()) {

            api.get(`http://localhost:3000/search?search=${searchText}`)
                .then((res) => {
                    setSearchUser(res.data)
                    // console.log(data)
                }).catch((err) => {
                    console.log(err)
                })
        }
    }

    return (
            <div className="nav">

                {/* LOGO-------------------------------------------------- */}

                <div className="left">
                    <Link to='/home'>
                        <h1>SocialSpace</h1>
                    </Link>
                </div>

                {/* SEARCH-BAR-------------------------------------------------- */}

                <div className="center">

                    <form className='sbar1' onSubmit={(e) => { e.preventDefault(); fetchSearch() }}>

                        <button style={{ background: 'transparent', border: 'transparent', padding: 0 }} type='submit'> <SearchIcon className='ci' /></button>
                        <input type='text' placeholder='search' value={searchText} onChange={(e) => { setSearchText(e.target.value) }} onFocus={() => setFocus3(true)} onBlur={() => setTimeout(() => { setFocus3(false); setSearchText(''); setSearchUser([]) }, 300)} />

                    </form>

                    {focus3 &&
                        <div className='sbar2'>
                            {searchUser?.map((f) => {
                                return (
                                    <div className='sba' key={f.id} onClick={() => { navigate(`/profile/${f.id}`); setSearchText(''); setSearchUser([]) }}>
                                        <img src={f ? `http://localhost:3000/public/${f?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 10 }} />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span><b>{f.fullname}</b></span>
                                            <span style={{ fontSize: 'x-small' }}>{f.gender}</span>
                                            <span style={{ fontSize: 'x-small' }}>{f.country}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>

                {/* ---------------------------------------------------- */}

                <div className="right">

                    {/* FRIEND-REQUESTS------------------------------------------------------ */}

                    <div className='freq'>
                        <Badge color='info' overlap="circular" badgeContent={notify.length}><GroupIcon className='ro' onClick={() => setFocus(!focus)} /></Badge>

                        {focus &&
                            <div className='fr1'>
                                <span style={{ padding: '0px 10px', background: '#0a0a87', color: 'white', fontWeight: 'bold' }}>Follow Requests</span>

                                {notify?.length === 0 && <span style={{ padding: '0px 10px', fontSize: 'small' }}>No pending requests</span>}

                                {notify?.map((item) => {
                                    return (

                                        <div key={item?.n_id} style={{ display: 'flex', margin: 5, border: '2px solid grey', position: 'relative' }}>

                                            <img src={item ? `http://localhost:3000/public/${item?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'} onClick={() => navigate(`/profile/${item?.id}`)} style={{ width: 50, height: 50, objectFit: 'cover', cursor: 'pointer' }} />

                                            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 5px' }}>
                                                <span style={{ fontWeight: 'bold' }}>{item?.fullname}</span>

                                                {friends.find((i) => i.id === item.id) ?
                                                    <div>
                                                        <CancelIcon onClick={() => n_del(item.n_id)} style={{ position: 'absolute', top: 0, right: 0, color: '#18188e', cursor: 'pointer' }} />
                                                        <span style={{ fontSize: 'small' }}>Followed you</span>
                                                    </div>
                                                    :
                                                    <div>
                                                        <button onClick={() => { f_follow(item.id); n_del(item.n_id); f_notify(item.id) }} style={{ background: '#18188e', cursor: 'pointer', border: 'transparent' }} >Follow Back</button>
                                                        <CancelIcon onClick={() => n_del(item.n_id)} style={{ position: 'absolute', top: 0, right: 0, color: '#18188e', cursor: 'pointer' }} />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </div>
                        }
                    </div>

                    {/* NOTIFICATION--------------------------------------------------- */}

                    <div className='freq'>
                        <Badge color='info' overlap="circular" badgeContent={commentNotify.length}><NotificationsIcon className='ro' onClick={() => setFocus4(!focus4)} /></Badge>

                        {focus4 &&
                            <div className='fr1'>
                                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#0a0a87' }}>
                                    <span style={{ padding: '0px 10px', color: 'white', fontWeight: 'bold' }}>Notifications</span>
                                    <button onClick={() => { setCommentNotify([]); setFocus4(false) }} style={{ background: 'white', color: '#0a0a87', cursor: 'pointer' }}>x</button>
                                </div>

                                {commentNotify?.length === 0 && <span style={{ padding: '0px 10px', fontSize: 'small' }}>No notifications</span>}

                                {commentNotify?.map((c, ind) => {
                                    return (
                                        <div key={ind} style={{ display: 'flex', padding: '5px 10px', borderBottom: '2px solid grey' }}>
                                            <span style={{ fontSize: 'small', fontWeight: 'bold' }}>{c}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </div>

                    {/* DROPDOWN-MENU---------------------------------------------------------------- */}

                    <div className='set'>

                        <div onClick={() => setFocus2(!focus2)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>

                            <img src={userpic ? `http://localhost:3000/public/${userpic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'} className='ri' />
                            <ArrowDropDownIcon />

                        </div>

                        {focus2 &&

                            <div className='set2'>

                                <span onClick={() => { navigate(`/profile/${userid}`); setFocus2(!focus2) }}><AccountCircleIcon />Profile</span>

                                <Divider sx={{ background: 'grey' }} />

                                <span onClick={() => { navigate('/settings'); setFocus2(!focus2) }}><SettingsIcon />Settings</span>

                                <span onClick={() => { navigate('/'); localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); socket.disconnect() }}><LogoutIcon />SignOut</span>

                            </div>
                        }
                    </div>

                    {/* ------------------------------------------------------ */}

                </div>
            </div>
    )
}

export default Navbar