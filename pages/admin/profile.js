import { useUser } from '../../lib/hooks'
import AdminHeader from '../../components/HeaderAdmin'

const Profile = () => {
  const user = useUser({ redirectTo: '/login' })

  return (
    <>
      <AdminHeader active="profile"></AdminHeader>
      <div className="max-w-3xl mx-auto">
        <h1>My Account</h1>

        {user && (
          <>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </>
        )}

        <style jsx>{`
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
      </div>
    </>
  )
}

export default Profile
