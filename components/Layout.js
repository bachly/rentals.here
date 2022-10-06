import Head from 'next/head'
import Header from './Header'

const Layout = (props) => (
  <>
    <Head>
      <title>Bike Rentals</title>
    </Head>

    <Header />

    <main>
      <div className="max-w-3xl mx-auto">{props.children}</div>
    </main>
  </>
)

export default Layout
