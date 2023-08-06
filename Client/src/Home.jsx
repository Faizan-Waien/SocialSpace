import './STYLING/Home.scss'
import { useContext, useEffect, useState } from 'react';
import StatusBox from './StatusBox'
import PostBox from './PostBox';
import FeedIcon from '@mui/icons-material/Feed';
import { UserContext } from './Context';
import { api } from './Interceptors';

const Home = () => {

  const { userid } = useContext(UserContext)

  const [status, setStatus] = useState([])

  useEffect(() => {
    fetchPosts()
  }, [userid])

  const fetchPosts = () => {
    if (userid) {
      api.get(`http://localhost:3000/posts/${userid}`)
        .then((res) => {
          setStatus(res.data)
          // console.log(res.data)
        }).catch((err) => {
          console.log(err);
        });
    }
    }

  return (

    <div className='home'>

      <div className='hedng'>
        <FeedIcon />
        <h2>News Feed</h2>
      </div>

      <div className="feed">

        <StatusBox fetchPosts={fetchPosts} />
        <PostBox status={status} setStatus={setStatus} fetchPosts={fetchPosts} userid={userid} />

      </div>
    </div>
  )
}

export default Home