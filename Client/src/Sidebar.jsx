import FeedIcon from '@mui/icons-material/Feed';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import EventIcon from '@mui/icons-material/Event';
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { FriendshipContext } from './FriendsContext';

const Sidebar = () => {

    const { friends, userid } = useContext(FriendshipContext)

    const navigate = useNavigate()

    const scroll = window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <div className='side'>

            {/* ------------------------------------------------------------ */}

            <div className='sbox'>
                <div onClick={() => { navigate('/home'); scroll }} className='sic'><FeedIcon /><span className='sidetab'>News Feed</span></div>
                <div onClick={() => { navigate(`/profile/${userid}`); scroll }} className='sic'><PersonIcon /><span className='sidetab'>Profile</span></div>
                <div onClick={() => { navigate('/findfriends'); scroll }} className='sic'><GroupsIcon /><span className='sidetab'>Find Friends</span></div>
            </div>

            {/* ------------------------------------------------------------ */}

            <div className='sbox'>

                <div className='hee'>
                    <div className='he'>
                        <h4>Explore</h4>
                    </div>
                </div>

                <div className='sic'><Diversity3Icon /><span className='sidetab'>Groups</span></div>
                <div className='sic'><EventIcon /><span className='sidetab'>Events</span></div>
                <div className='sic'><ArticleIcon /><span className='sidetab'>Pages</span></div>
            </div>

            {/* FOLLOWED------------------------------------------------------ */}

            <div className='sbox'>

                <div className='hee'>
                    <div className='he'>
                        <h4>Followed</h4>
                        <h4>({friends.length})</h4>
                    </div>

                    <span onClick={() => navigate('/friends')}>see all</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {friends.slice(0, 5).map((f) => {
                        return (
                            <div key={f.id} onClick={() => { navigate(`/profile/${f.id}`); scroll }} style={{ display: 'flex', flexDirection: 'row', margin: '5px 10px', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                                <img src={f?.profilepic ? `http://localhost:3000/public/${f?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 10 }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='sidetab' ><b>{f.fullname}</b></span>
                                    <span className='sidetab' style={{ fontSize: 'x-small' }}>{f.gender}</span>
                                    <span className='sidetab' style={{ fontSize: 'x-small' }}>{f.country}</span>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>

            {/* ------------------------------------------------------------- */}

        </div>
    )
}

export default Sidebar