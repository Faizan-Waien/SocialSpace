import AttachFileIcon from '@mui/icons-material/AttachFile';
import { UserContext } from './Context';
import { useContext, useState } from 'react';
import { useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import MoodIcon from '@mui/icons-material/Mood';
import { api } from './Interceptors';

const StatusBox = ({ fetchPosts }) => {

  const imgRef = useRef()

  const datetime = new Date().toLocaleString()

  const { userid } = useContext(UserContext)

  const [post, setPost] = useState('')

  const [selectedFiles, setSelectedFiles] = useState('')

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const setImage = (e) => {
    imgRef.current.style.display = 'flex';
    imgRef.current.src = URL.createObjectURL(e.target.files[0]);
    imgRef.current.onload = function () {
      URL.revokeObjectURL(imgRef.current.src) // free memory
    }
    setSelectedFiles(e.target.files[0])
  }

  const Posted = (e) => {
    e.preventDefault()

    if (post || selectedFiles) {

      const formData = new FormData();

      formData.append('content', post);
      formData.append('userid', userid);
      formData.append('datetime', datetime);
      formData.append('file', selectedFiles);

      api.post('http://localhost:3000/posts', formData)
        .then((res) => {
          const data= res.data
          console.log('Posted', data)

          // setStatus((st) => [data, ...st])
          fetchPosts()
        }).catch((err) => {
          console.log(err)
        })

      imgRef.current.style.display = 'none';
      setSelectedFiles("")
      setPost("")

    }
  }

  return (
    <div className='status'>

      <form onSubmit={Posted} encType="multipart/form-data">

        <div className='top'>

          <div className='tp1'>
            <label>
              <input name='attach' type='file' onChange={setImage} style={{ display: 'none' }} />
              <AttachFileIcon />Attach File/Photo
            </label>
          </div>

          <div className='tp2'>
            <img ref={imgRef}></img>
          </div>

        </div>

        <div className='bottom'>
          <div className='b1'>
            <textarea
              placeholder='Whats on your mind'
              value={post}
              type='text'
              onChange={(e) => setPost(e.target.value)} />
          </div>

          <div className='b2'>
            <button className='bbt' type='submit'>Post</button>
            <MoodIcon onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{float:'right', color: '#313385', padding:'10px 0px', cursor:'pointer'}}/>

            {showEmojiPicker &&
              <div style={{ position: 'absolute', top: 40, right: 0, zIndex: 999 }}>
                <EmojiPicker onEmojiClick={(emojiObject) => setPost((prevText) => prevText + emojiObject.emoji)} height={400} width={300} />
              </div>
            }
          </div>
        </div>
      </form>
    </div>
  )
}

export default StatusBox