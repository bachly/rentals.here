import clsx from "clsx";
import Link from "next/link";
import { useUser } from '../lib/hooks'

export default function AdminHeader({ active }) {
    const user = useUser()

    return <header className="bg-black">
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="text-white mr-4">ADMIN</div>
                    <Link href="/admin">
                        <a className={clsx('block py-2 px-4 text-white', active === "index" && 'bg-blue-500')}>Bikes</a>
                    </Link>
                    <Link href="/admin/users">
                        <a className={clsx('block py-2 px-4 text-white', active === "users" && 'bg-blue-500')}>Users</a>
                    </Link>
                </div>
                {user &&
                    <div className="flex items-center">
                        <Link href="/profile">
                            <a className={clsx(active === 'profile' && 'bg-blue-500 px-4 mr-2', 'block py-2 px-2 text-white')}>My account</a>
                        </Link>
                        <Link href="/api/logout">
                            <a className="block py-2 px-2 text-white">Logout</a>
                        </Link>
                    </div>
                }
            </div>
        </div>
    </header>
}