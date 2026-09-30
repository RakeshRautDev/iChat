import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

const PublicRoute = ({ children }) => {
    const { isSignedIn, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isSignedIn) {
        return <Navigate to="/chat" replace />;
    }

    return children;
};

export default PublicRoute;