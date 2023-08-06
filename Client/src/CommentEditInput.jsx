import './STYLING/CommentEditInput.scss'
import { useRef, useState } from "react"
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import { api } from './Interceptors';

const CommentEditInput = ({ status, item, setStatus, fetchPosts }) => {

    const [edit, setEdit] = useState('')

    const Retype = (id) => {
        const obj = {
            edit,
            id,
        }
        api.put('http://localhost:3000/editpost', obj)
            .then((res) => {
                const data = res.data
                console.log('editPost', data)

                setStatus(
                    status.map((item) => item.id === data.id
                        ? data
                        : item))

                fetchPosts()

            }).catch((err) => {
                console.log(err)
            })
        setEdit('')
    }

    const deleteItem = (id) => {
        const obj = {
            id,
        }
        console.log(obj)

        api.delete('http://localhost:3000/posts', { data: obj })
            .then((res) => {
                const data = res.data
                console.log('deletePost',data)

                const UpdatedItems = status.filter((item) => item.id !== data.id)
                setStatus(UpdatedItems)
                fetchPosts()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const cbox = useRef(null)

    const now = () => {
        cbox.current.style.display = "flex"
    }

    const cancl = () => {
        cbox.current.style.display = "none"
    }

    return (
        <div className='edt'>

            <div className='c2' ref={cbox}>
                <textarea placeholder='Edit Comment' value={edit} type='text' onChange={(e) => setEdit(e.target.value)} />
                <div>
                    <button onClick={edit ? () => Retype(item.postid) : null}>Edit</button>
                    <button onClick={cancl}>Cancel</button>
                </div>
            </div>

            <div className='ed1'>
                <MoreHorizTwoToneIcon />

                <div className='ed2'>

                    <div className="c1" onClick={now}><span>Edit</span></div>

                    <div onClick={() => deleteItem(item.postid)}><span>Remove</span></div>

                </div>
            </div>

        </div>
    )
}

export default CommentEditInput