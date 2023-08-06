import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { Badge } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from './Context';
import { socket } from './Chat';
import { api } from './Interceptors';

const CommentAction = ({ item, status, setStatus, toggleC, setToggleC }) => {

    const { userid, userfullname } = useContext(UserContext)

    const Opinion2 = ({ postid }) => {
        const obj = {
            postid,
            userid,
        }

        api.post('http://localhost:3000/likes', obj)
            .then((res) => {
                const data = res.data
                // console.log('likes', data)

                const updatedStatus = status.map(item => {
                    if (item.postid === data?.post_liked) {
                        const updatedLikes = [...item.likes, data];
                        return {
                            ...item,
                            liked_status: data.liked_status,
                            likes: updatedLikes
                        };
                    }
                    return item;
                });
                setStatus(updatedStatus);

            })
            .catch((err) => {
                if (err.response.status >= 400) {
                    const data = err.response.data
                    // console.log('dislike', data)

                    const deleteLike = status.map(item => {
                        if (item.postid === data?.post_liked) {
                            return {
                                ...item,
                                liked_status: data.liked_status,
                                likes: item.likes.filter((item) => item.id !== data.id)
                            };
                        }
                        return item;
                    });
                    setStatus(deleteLike);
                }
            })
    }

    const L_Notify = (item) => {
        socket.emit('send_notification', {
            alert: item.liked_status ? `${userfullname} removed like from your post` : `${userfullname} likes your post`,
            receiverID: item.userid,
            senderID: userid,
        })
    }

    return (

        <div className='box'>

            <div className='bx1' style={{ position: 'relative' }}>
                <Badge color='info' overlap="circular" badgeContent={item.likes.length}><ThumbUpIcon color={item.liked_status ? 'primary' : 'white'} /></Badge>
                <span className='sp1' onClick={() => { Opinion2(item); L_Notify(item) }}>Like</span>

                <div className='bx1a'>
                    {item.likes.map((i) => {
                        return (
                            <div key={i.id}>
                                <img src={i?.profilepic ? `http://localhost:3000/public/${i?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'} />

                                <span>{i.fullname}</span>
                            </div>

                        )
                    })}
                </div>

            </div>

            <div className='bx2'>
                <Badge color='info' overlap="circular" badgeContent={item.comments.length}><CommentIcon style={{ color: toggleC && '#232377' }} /></Badge>
                <span className='sp1' onClick={() => setToggleC(!toggleC)}>Comments</span>
            </div>

        </div>
    )
}

export default CommentAction