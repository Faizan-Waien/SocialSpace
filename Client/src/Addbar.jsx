import { useEffect, useState } from "react"
import { add1 } from "./Adds"
import ChatBox from "./Chatbox";

const Addbar = () => {

  const [ad1, Ad1] = useState(add1)
  const [picID, setPicID] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPicID((v) => (v === 5 ? 0 : v + 1));
    }, 5000);
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='add'>

      <div style={{ width: '100%', display: "flex", flexDirection: 'column' }}>

        <h4 className="adh" >Sponsored</h4>

        <div style={{ display: "flex", flexDirection: "column", textAlign: "center", padding: '2px', background: 'black', margin: 'auto', width: '80%' }}>
          <h3 style={{ color: 'red', margin: 0 }}>FLAT 50%</h3>
          <span style={{ color: "white", fontSize: '11px' }}>on all Women Collection</span>
          <img src={`${ad1[picID]}`} style={{ height: 230, objectFit: 'fill' }} />
          <img src='/src/assets/logo.png' />
        </div>

        <br />

        <ChatBox />

      </div>
    </div>
  )
}

export default Addbar