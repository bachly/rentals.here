import clsx from "clsx";
import Link from "next/link";

export default function AdminHeader({ active }) {
    return <header className="bg-black">
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center">
                <Link href="/admin">
                    <a className={clsx('block py-2 px-4 text-white', active === "index" && 'bg-blue-500')}>Bikes</a>
                </Link>
                <Link href="/admin/users">
                    <a className={clsx('block py-2 px-4 text-white', active === "users" && 'bg-blue-500')}>Users</a>
                </Link>
            </div>
        </div>
    </header>
}