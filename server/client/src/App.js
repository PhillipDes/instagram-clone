import Navbar from "./components/Navbar";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useUserContext } from "./hooks/useUserContext";

//pages
import Home from "./pages/Home"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import UserProfile from "./pages/UserProfile"
import CreatePost from "./pages/CreatePost"
import FollowingPosts from "./pages/FollowingPosts";
import Reset from "./pages/Reset";
import NewPassword from "./pages/NewPassword";

function App() {
  const {user} = useUserContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/signin" />} />
            <Route path="/signin" element={!user ? <Signin /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route path="/profile/:userid" element={<UserProfile />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/following" element={<FollowingPosts />} />
            <Route exact path="/reset" element={<Reset />} />
            <Route path="/reset/:token" element={<NewPassword />} />
          </Routes> 
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
