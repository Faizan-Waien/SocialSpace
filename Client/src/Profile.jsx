import './STYLING/Home.scss'
import { useContext, useEffect, useState } from 'react';
import StatusBox from './StatusBox';
import PostBox from './PostBox';
import { UserContext } from './Context';
import ProfileBanner from './ProfileBanner';
import { useParams } from 'react-router-dom';
import { api } from './Interceptors';

const Profile = () => {

  const { userid } = useContext(UserContext)

  const { profileid } = useParams()

  const [profilestatus, setProfleStatus] = useState([])

  useEffect(() => {
    fetchProfilePosts()
  }, [profileid])

  const fetchProfilePosts = () => {
    if (profileid) {
      api.get(`http://localhost:3000/userposts/${profileid}`)
        .then((res) => {
          setProfleStatus(res.data)
          // console.log(res.data)
        }).catch((err) => {
          console.log(err);
        });
    }
  }

  return (

    <div>

      <ProfileBanner profileid={profileid} userid={userid} />

      <div className='feed'>

        {profileid == userid &&
          <StatusBox fetchPosts={fetchProfilePosts} />
        }

        <PostBox status={profilestatus} setStatus={setProfleStatus} fetchPosts={fetchProfilePosts} userid={userid} />

      </div>

    </div>
  )
}

export default Profile