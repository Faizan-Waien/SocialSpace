import CommentEditInput from './CommentEditInput';
import PostComment from './PostComment';

const PostBox = ({ status, setStatus, fetchPosts, userid }) => {
   
   
    return (
        <div style={{ display:'block', width:'100%'}}>

            {status.map((item) => {
                return (

                    <div className='post' key={item.postid}>

                        <div className='topbar'>

                            <div style={{ display: 'flex', alignItems: 'center' }}>

                                <img src={item?.profilepic ? `http://localhost:3000/public/${item?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg' } />
                                
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: 'smaller', fontWeight: 'bold', color: '#6771c0' }}>{item.fullname}</span>
                                    <span style={{ fontSize: 'small' }}>{item.date_time}</span>
                                </div>

                            </div>
                            {item.userid===userid ? <CommentEditInput status={status} setStatus={setStatus} item={item} fetchPosts={fetchPosts} /> : null}
                        </div >

                        <div className='bottombar'>

                            <p>{item.content}</p>

                            {item.filepath &&
                                <img src={`http://localhost:3000/public/${item.filepath}`} onClick={() => window.open(`http://localhost:3000/public/${item.filepath}`, '_blank')} />
                            }
                            <div className='bb1'></div>
                            <div className='bb2'></div>

                        </div>

                        <PostComment item={item} fetchPosts={fetchPosts} status={status} setStatus={setStatus} />
                    </div>

                )
            })
            }
        </div>
    )
}

export default PostBox