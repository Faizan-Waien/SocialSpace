import { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from './Context'
import { api } from './Interceptors'

export const FriendshipContext = createContext()

const value2 = () => {

    const { userid } = useContext(UserContext)

    const [friends, setFriends] = useState([])
    const [findFriends, setFindFriends] = useState([])
    const [notify, setNotify] = useState([])
    // --------------------------------------------
    useEffect(() => {
        fetchFriends()
        fetchfindFriends()
        fetchNotifications()
    }, [userid])

    const fetchFriends = () => {
        if (userid) {
            api.get(`http://localhost:3000/friends/${userid}`)
                .then((res) => {
                    setFriends(res.data)
                    // console.log('friends', res.data)
                }).catch((err) => {
                    console.log(err)
                })
        }
    }

    const fetchfindFriends = () => {
        if (userid) {
            api.get(`http://localhost:3000/findfriends/${userid}`)
                .then((res) => {
                    setFindFriends(res.data)
                    // console.log('findFriends', res.data)
                }).catch((err) => {
                    console.log(err)
                })
        }
    }

    const fetchNotifications = () => {
        if (userid) {
            api.get(`http://localhost:3000/notifications/${userid}`)
                .then((res) => {
                    setNotify(res.data)
                    // console.log('notification', res.data)
                }).catch((err) => {
                    console.log(err)
                })
        }
    }

    // ----------------------------------------------  
    const f_del = (id) => {
        api.delete('http://localhost:3000/friends', { data: { id } })
            .then((res) => {
                const data = res.data
                console.log('fdel', data)

                const updatedFriends = friends.filter((item) => item.f_id !== data.f_id)
                setFriends(updatedFriends)
                fetchfindFriends()
            }).catch((err) => {
                console.log(err)
            })
    }
    // -----------------------------------------------
    const f_follow = (id) => {
        api.post('http://localhost:3000/friends', { userid, id })
            .then((res) => {
                const data = res.data
                console.log(data)

                const updatedFindFriends = findFriends.filter((item) => item.id !== data.id_friend)
                setFindFriends(updatedFindFriends)
                fetchFriends()
            }).catch((err) => {
                console.log(err)
            })
    }

    const f_notify = (id) => {
        api.post('http://localhost:3000/notifications', { userid, id })
            .then((res) => {
                console.log(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }
    // ---------------------------------------------
    const n_del = (id) => {
        api.delete('http://localhost:3000/notifications', {data: { id }})
            .then((res) => {
                const data= res.data
                console.log('ndel', data)

                const updatedFriends = notify.filter((item) => item.n_id !== data.n_id)
                setNotify(updatedFriends)
            }).catch((err) => {
                console.log('ndel', err.response.data)
            })
    }

    const n_del1 = (id) => {
        api.delete('http://localhost:3000/notifications1', {data: { id, userid }})
            .then((res) => {
                console.log('ndel1', res.data)
            }).catch((err) => {
                console.log('ndel1', err.response.data)
            })
    }

    const n_del2 = (id) => {
        api.delete('http://localhost:3000/notifications1', {data: { id: userid, userid: id }})
            .then((res) => {
                console.log('ndel2', res.data)
                // fetchNotifications()
            }).catch((err) => {
                console.log('ndel2', err.response.data)
            })
    }
    // ------------------------------------------
    return { friends, findFriends, notify, f_del, f_follow, f_notify, n_del, n_del1, n_del2, userid }
}

export const FriendshipProvider = ({ children }) => {
    return (
        <FriendshipContext.Provider value={value2()}>{children}</FriendshipContext.Provider>
    )
}