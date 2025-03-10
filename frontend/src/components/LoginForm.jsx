import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        try{
            const res = await api.post("/login", {username, password})
            localStorage.setItem(ACCESS_TOKEN, res.data.access_token)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh_token)
            navigate("/")
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }
    }

    return(
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Login</h1>
            <input type="text" placeholder="Username" className="" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" className="" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className="" type="submit">Login</button>
        </form>
    )

}

export default LoginForm