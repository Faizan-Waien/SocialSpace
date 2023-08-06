import './STYLING/Home.scss'
import { useContext } from 'react'
import { FriendshipContext } from './FriendsContext';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';

const FindFriends = () => {

    const { f_follow, f_notify, findFriends, f_del, n_del2, friends, userid } = useContext(FriendshipContext)

    const navigate = useNavigate()

    return (
        <div className='home'>

            <div className='hedng'>
                <GroupsIcon style={{ width: 35, height: 35 }} />
                <h2>Find Friends</h2>
            </div>

            <div>
                {findFriends.map((user) => {
                    return (
                        <div className='find' key={user.id}>

                            <div className='fimg'>
                                <img src={user.profilepic ? `http://localhost:3000/public/${user?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'}
                                    onClick={() => { navigate(`/profile/${user.id}`); scroll }} />
                            </div>

                            <div className='find2'>
                                <span><b>Name:</b> {user.fullname}</span>
                                <span><b>Gender:</b> {user.gender}</span>
                                <span><b>Country:</b> {user.country}</span>
                            </div>

                            {friends.find((item) => item.id === user.id) ? (
                                <button className='followbtn'>Following</button>
                            ) : (
                                <button className='followbtn' onClick={() => { f_follow(user.id); f_notify(user.id); n_del2(user.id) }}>
                                    {user.followed.find((item) => item.id_friend == userid) ? <span>Follow Back</span> : <span>Follow</span>}
                                </button>
                            )}

                        </div>
                    )
                })}
            </div>

        </div>
    )
}

export default FindFriends