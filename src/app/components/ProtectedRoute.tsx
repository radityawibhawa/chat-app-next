import { useRouter } from "next/router";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt){
            router.push('/login');
        }
    }, [router])

    return <>{children}</>;
};

export default ProtectedRoute;

