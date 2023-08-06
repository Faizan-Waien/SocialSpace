import { useContext } from 'react'
import { FriendshipContext } from './FriendsContext';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const Friends = () => {

  const { friends, f_del, n_del1 } = useContext(FriendshipContext)

  const navigate = useNavigate()

  return (
    <div className='home'>

      <div className='hedng'>
        <PersonIcon />
        <h2>Friends</h2>
      </div>

      {friends.map((f) => {
        return (
          <div className='find' key={f.id}>

            <div className='fimg'>
              <img src={f?.profilepic ? `http://localhost:3000/public/${f?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'}
                onClick={() => { navigate(`/profile/${f.id}`); scroll }} />
            </div>

            <div className='find2'>
              <span><b>Name:</b> {f.fullname}</span>
              <span><b>Gender:</b> {f.gender}</span>
              <span><b>Country:</b> {f.country}</span>
            </div>

            <button className='followbtn' onClick={() => { f_del(f.f_id); n_del1(f.id) }}>Unfollow</button>
          </div>
        )
      })}

    </div>
  )
}

export default Friends