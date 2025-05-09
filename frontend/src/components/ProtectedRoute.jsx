import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({children}){
    const [IsAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    
        if (!refreshToken) {
            setIsAuthorized(false);
            return;
        }
    
        try {
            const res = await api.post(
                "/refresh", 
                {}, 
                {
                    headers: { Authorization: refreshToken },
                    skipAuth: true,
                }
            );
    
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            setIsAuthorized(false);
            console.error("Token refresh error:", error);
        }
    };
    
    

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        
        if (token) {
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                await refreshToken();
            } else {
                setIsAuthorized(true);
                return;
            }
        }
        
        setIsAuthorized(false);
    };
    

    if(IsAuthorized === null){
        return <div>Loading...</div>
    }

    return IsAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute