"use client"

import { useAuth, useUser } from "@clerk/nextjs"

const unauthorized = () => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">Unauthorized</h1>
                <p className="text-center">You do not have permission to access this page.</p>
            </div>
        </div>
    )
}
export default unauthorized