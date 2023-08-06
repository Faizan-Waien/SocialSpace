import { useContext, useEffect, useState } from "react"
import Chat from "./Chat"
import { FriendshipContext } from "./FriendsContext"
import CircleIcon from '@mui/icons-material/Circle';
import { api } from "./Interceptors";

const ChatBox = () => {

  const { userid } = useContext(FriendshipContext)

  // const [room, setRoom] = useState('')
  // const [chat, setChat] = useState([])
  const [chatID, setChatID] = useState('')
  const [chatSelect, setChatSelect] = useState('')
  const [online, setOnline] = useState([])

  useEffect(() => {
    fetchSocketUsers()
  }, [userid])

  const fetchSocketUsers = () => {
if(userid){
    api.get(`http://localhost:3000/user-socket-map/${userid}`)
      .then((res) => {
        setOnline(res.data)
        // console.log(data)
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  return (
    <div>

      <div style={{ width: '100%', display: "flex", flexDirection: 'column' }}>

        <h4 className="adh">Friends Online</h4>

        {online.map((item, ind) => {
          return (

            <div key={ind} style={{ display: "flex", flexDirection: "row", gap: 10, cursor: "pointer", padding: '0px 5px' }}
              onClick={() => {
                // setRoom(JSON.stringify(item.id));
                // setChat([]);
                setChatID(item?.id)
                setChatSelect(item?.fullname)
                // document.getElementById('cb').style.display = 'flex';
              }}>
              <div style={{ position: "relative" }}>
                <img src={item ? `http://localhost:3000/public/${item?.profilepic}` : 'http://localhost:3000/public/profile-pictures/dp.jpg'}
                  style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: '50px' }} />

                <CircleIcon style={{ position: "absolute", left: 20, bottom: 10, width: 15, height: 15, color: "green" }} />
              </div>


              <span style={{ fontWeight: "bold" }}>{item.fullname}</span>

            </div>
          )
        })}
      </div>

      {/* <div id='cb' style={chat.length > 0 ? { display: "flex" } : { display: "none" }} > */}
      <Chat chatID={chatID} setChatID={setChatID} chatSelect={chatSelect} setChatSelect={setChatSelect}/>
      {/* room={room} setRoom={setRoom} chat={chat} setChat={setChat}*/}
      {/* </div> */}

    </div >
  )
}

export default ChatBox