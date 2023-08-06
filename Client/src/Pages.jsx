import { Routes, Route, Outlet } from "react-router-dom"
import Home from "./Home"
import Profile from "./Profile"
import SignIn from "./SignIn"
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Addbar from './Addbar'
import SignUp from "./SignUp"
import Settings from "./Settings"
import { UserProvider } from "./Context"
import Footer from "./Footer"
import FindFriends from "./FindFriends"
import Friends from "./Friends"
import { FriendshipProvider } from "./FriendsContext"

const Pages = () => {

    const token = localStorage.getItem('token');

    return (
        <div>
            <Routes>

                <Route exact path='/' Component={SignIn} />

                <Route exact path='/signup' Component={SignUp} />

                <Route element={
                    <div>
                        <UserProvider>
                            <FriendshipProvider>
                                <Navbar />
                                <Sidebar />
                                <Addbar />
                                <Outlet />
                                <Footer />
                            </FriendshipProvider>
                        </UserProvider>
                    </div>
                }>

                    <Route exact path='/home' Component={Home} />
                    <Route exact path='/profile/:profileid' Component={Profile} />
                    <Route exact path='/settings' Component={Settings} />
                    <Route exact path='/findfriends' Component={FindFriends} />
                    <Route exact path='/friends' Component={Friends} />

                </Route>

            </Routes>
        </div>
    )
}

export default Pages