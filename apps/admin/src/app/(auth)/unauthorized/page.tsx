"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { ShieldAlert } from "lucide-react"

const UnauthorizedPage = () => {
    const { user } = useUser()
    const { signOut } = useClerk()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push("/sign-in")
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 text-center">
                <div className="inline-flex p-3 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-500 mb-4">
                    <ShieldAlert className="h-10 w-10" />
                </div>
                
                <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
                    Access Denied
                </h1>
                
                <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
                    You do not have administrative privileges to access the Rajasthalli Admin Dashboard.
                </p>
                
                {user && (
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg text-sm text-zinc-500 mb-6 border border-zinc-100 dark:border-zinc-900">
                        Logged in as: <strong className="text-zinc-700 dark:text-zinc-300 font-medium">{user.primaryEmailAddress?.emailAddress}</strong>
                    </div>
                )}

                <button
                    onClick={handleSignOut}
                    className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 rounded-lg text-sm font-medium transition duration-200"
                >
                    Sign Out & Switch Account
                </button>
            </div>
        </div>
    )
}

export default UnauthorizedPage
