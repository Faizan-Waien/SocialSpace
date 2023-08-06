import { createContext, useEffect, useState } from 'react'
import { api } from './Interceptors'

export const UserContext = createContext()

const value = () => {

    const [loginUser, setLoginUser] = useState([])

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = () => {

        api.get(`http://localhost:3000/users`)
            .then((res) => {
                setLoginUser(res.data)
                // console.log(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }

    const userid = loginUser.id
    const username = loginUser.username
    const userpic = loginUser.profilepic
    const userfullname = loginUser.fullname

    return { loginUser, userid, username, userpic, userfullname }
}

export const UserProvider = ({ children }) => {
    return (
        <UserContext.Provider value={value()}>{children}</UserContext.Provider>
    )
}
