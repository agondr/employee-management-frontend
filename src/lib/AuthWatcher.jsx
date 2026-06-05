import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthWatcher() {
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    useEffect(() => {
        const publicRoutes = ["/", "/login", "/register"];

        if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
            navigate("/" + location.search, { replace: true });
        }
    }, [isAuthenticated, location.pathname, navigate]);

    return null;
}