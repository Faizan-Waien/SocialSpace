import { useEffect, useState } from "react"
import { io } from 'socket.io-client'
import { UserContext } from "./Context";
import { useContext } from "react";
import SendIcon from '@mui/icons-material/Send';
import CircleIcon from '@mui/icons-material/Circle';

export const socket = io('http://localhost:3000/', { autoConnect: false });

const Chat = ({ chatID, setChatID, chatSelect, setChatSelect/* ,room, setRoom, chat, setChat, */ }) => {

    const { loginUser } = useContext(UserContext)

    const [chat, setChat] = useState([])
    const [chatMSG, setChatMSG] = useState('')
    const [chatsender, setChatsender] = useState('')
    const [light, setLight] = useState(false)

    useEffect(() => {
        if (loginUser.id) {

            // setRoom(`${loginUser.id}`)

            socket.connect()

            socket.emit('join_private_chat', {
                room: 'ChatRoom',
                id: loginUser.id,
                profilepic: loginUser.profilepic,
                fullname: loginUser.fullname,
            })

            socket.on('receive_private_message', (data) => {
                console.log('Received message:', data);
                setChat((prev) => [{ sender: data.sender, message: data.message }, ...prev])

                setLight(true)
                setChatsender(data.sender)
                setChatID(data.senderId)
                // console.log(socket.listeners('receive_private_message'));
            })

            return () => {
                socket.off('receive_private_message');
            }
        }
    }, [socket, loginUser.id])

    const handleMSG = () => {

        if (loginUser.id && chatID) {
            socket.emit('send_private_message', {
                sender: loginUser.fullname,
                senderId: loginUser.id,
                recipientId: chatID,
                room: 'ChatRoom',
                message: chatMSG,
            })
            setChat((prevChat) => [{ sender: 'You', message: chatMSG }, ...prevChat]);
            setChatMSG('')
            setLight(false)
        }
    }

    if (Object.keys(loginUser).length) {
        return (
            <div>
                {(chatSelect || chatsender) &&
                    <div className='chat'>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>

                            <div style={{display:"flex"}}>
                                <CircleIcon style={light ? {color:'green'} : {color:'grey'}}/>
                                <h3>ChatRoom <span style={{ fontSize: 'small', color: "grey" }}>(#{chatSelect || chatsender})</span></h3>
                            </div>

                            <button  onClick={() => { setChatsender(''); setChatSelect('') /* ;document.getElementById('cb').style.display = 'none' */ }} style={{ cursor: "pointer" }}>x</button>
                        </div>

                        <div className="ch1">

                            {chat.map((msg, index) => (

                                <div key={index} style={{borderBottom:'1px solid grey', fontSize: 'small'}}>
                                    <span><b>{msg.sender}:</b> {msg.message}</span>
                                </div>
                            ))}

                        </div>

                        <div className="ch2">
                            <input value={chatMSG} onChange={(e) => setChatMSG(e.target.value)} />
                            <SendIcon className="bt" onClick={handleMSG} />
                        </div>
                    </div>
                }
            </div>
        )
    } else { null }
}

export default Chat