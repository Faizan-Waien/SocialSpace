import './STYLING/PostComment.scss'
import { useContext, useState } from 'react'
import MoodIcon from '@mui/icons-material/Mood';
import SendIcon from '@mui/icons-material/Send';
import CommentAction from './CommentAction';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { UserContext } from './Context';
import EmojiPicker from 'emoji-picker-react';
import { socket } from './Chat';
import { api } from './Interceptors';

const PostComment = ({ item, fetchPosts, status, setStatus }) => {

    const { userid, userfullname } = useContext(UserContext)

    const [comment, setComment] = useState('')

    const [toggleC, setToggleC] = useState(false)

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const postComment = (id) => {

        if (comment) {
            const obj = {
                comment,
                id,
                userid
            }
            api.post('http://localhost:3000/comments', obj)
                .then((res) => {
                    const data = res.data
                    console.log('comment', data)

                    setStatus(
                        status.map((item) => item.id === data.id
                            ? data
                            : item))
                    fetchPosts()
                })
                .catch((err) => {
                    console.log(err)
                })
            setComment('')
        }
    }

    const commentLike = ({ id, liked }) => {
        const obj = {
            id,
            liked: !liked,
        }
        api.put('http://localhost:3000/comments', obj)
            .then((res) => {
                const data = res.data
                console.log(data)

                const post = { ...status.find((item) => item.postid === data.post_id) }
                const comments = post.comments.map(cmnt => cmnt.id === data.id ? { ...cmnt, liked: data.liked } : cmnt)
                post.comments = comments

                setStatus(
                    status.map((item) => item.postid === data.post_id
                        ? post
                        : item))

                // setStatus(
                //     status.map((item) => item.id === data.post_id
                //         ? data
                //         : item))
                // fetchPosts()
            }).catch((err) => {
                console.log(err)
            })
    }

    const commentDel = (id) => {
        api.delete('http://localhost:3000/comments', { data: { id } })
            .then((res) => {
                const data = res.data
                console.log(data)

                const UpdatedItems = status.filter((curElem) => curElem.id !== data.id)
                setStatus(UpdatedItems)
                fetchPosts()
            }).catch((err) => {
                console.log(err)
            })
    }

    const C_Notify = (item) => {
        socket.emit('send_notification', {
            alert: `${userfullname} comments on your post`,
            receiverID: item.userid,
            senderID: userid,
        })
    }

    const CL_Notify = (comment) => {
        socket.emit('send_notification', {
            alert: comment.liked ? `${userfullname} removed like from your comment` : `${userfullname} likes your comment`,
            receiverID: comment.user_id,
            senderID: userid,
        })
    }

    return (
        <div style={{width:'100%'}}>
            <CommentAction status={status} setStatus={setStatus} item={item} toggleC={toggleC} setToggleC={setToggleC} />

            {/* --------------------------------------- */}

            <div className='inp'>

                <input placeholder='Write a comment...' type='text' value={comment} onChange={(e) => setComment(e.target.value)} />
                <SendIcon className='inpbut' onClick={() => { postComment(item.postid); C_Notify(item) }} />

                <MoodIcon className='inpbut' onClick={() => setShowEmojiPicker(!showEmojiPicker)} />

                {showEmojiPicker &&
                    <div style={{ position: 'absolute', top: 40, right: 0, zIndex: 999 }}>
                        <EmojiPicker onEmojiClick={(emojiObject) => setComment((prevText) => prevText + emojiObject.emoji)} height={400} width={300} />
                    </div>
                }

            </div>

            {/* ---------------------------------------- */}

            <div className={!toggleC ? 'comnone' : 'combox'}>

                {item.comments.length === 0 ? <span className='ts'>No comments yet</span> : <span className='ts'>Comments:</span>}

                {item?.comments?.map(comment => {
                    return (
                        <div className='com1' key={comment.id}>
                            <div className='com2'>
                                <div className='cA'>
                                    <img src={comment?.profilepic ? `http://localhost:3000/public/${comment?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'} />
                                </div>

                                <div className='cB'>

                                    <div className='cBa'>
                                        <div>
                                            <span>{comment.fullname}</span>
                                        </div>

                                        <div style={{ display: 'flex' }}>

                                            <div onClick={userid === item.userid ? (() => { commentLike(comment); CL_Notify(comment) }) : null}>
                                                <span style={{
                                                    color: comment.liked ? '#232377' : 'grey',
                                                    cursor: userid === item.userid ? 'pointer' : 'default',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 'xx-small'
                                                }}>
                                                    <ThumbUpIcon />{item.fullname}
                                                </span>
                                            </div>

                                            {/* {userid === comment.user_id && <div onClick={() => commentDel(comment.id)}><DeleteIcon style={{ color: 'maroon', width: 20, cursor: 'pointer', paddingTop: 5 }} /></div>} */}

                                            {userid === comment.user_id &&
                                                <div onClick={() => commentDel(comment.id)}>
                                                    <button style={{ background: 'maroon', width: '12px', height: '12px', padding: 0, cursor: 'pointer',border:'transparent', textAlign: 'center', position: 'absolute', right: 0, top: -5,fontSize: '11px',fontWeight:'bold' }}>x</button>
                                                </div>
                                            }

                                        </div>

                                    </div>

                                    <div className='cBb'>
                                        <span>{comment.content}</span>
                                    </div>

                                </div>

                            </div>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PostComment