import clsx from 'clsx'
import Link from 'next/link'
import { useUser } from '../lib/hooks'

const Header = ({ active }) => {
  const user = useUser()

  return (
    <header className="bg-black mb-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className={clsx(active === 'index' && 'bg-blue-500', 'block py-2 px-4 text-white border-l border-r border-gray-800')}>Bikes</a>
            </Link>
            {user && <>
              <Link href="/reservations">
                <a className={clsx(active === 'reservations' && 'bg-blue-500', 'block py-2 px-4 text-white border-r border-gray-800')}>My reservations</a>
              </Link>
              <Link href="/rateABike">
                <a className={clsx(active === 'rateABike' && 'bg-blue-500', 'block py-2 px-4 text-white border-r border-gray-800')}>Rate a bike</a>
              </Link>
            </>}
          </div>
          <div className="flex items-center">
            {user &&
              <>
                <Link href="/profile">
                  <a className={clsx(active === 'profile' && 'bg-blue-500', 'block py-2 px-4 border-r border-l border-gray-800 text-white')}>
                    Hi {user.username}
                  </a>
                </Link>

                <Link href="/api/logout">
                  <a className="block py-2 px-4 text-white border-r border-gray-800">Logout</a>
                </Link>
              </>
            }
            {!user && <>
              <Link href="/login">
                <a className="block py-2 px-4 text-white">Login</a>
              </Link>
            </>}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
