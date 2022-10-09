import Head from 'next/head'
import Header from './Header'

const Layout = ({ active, children }) => (
  <>
    <Head>
      <title>Bike Rentals</title>
    </Head>

    <Header active={active} />

    <main>
      <div className="max-w-3xl mx-auto">{children}</div>
    </main>
  </>
)

export default Layout
