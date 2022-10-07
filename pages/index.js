import { useUser } from '../lib/hooks'
import Layout from '../components/Layout'
import React from 'react';
import useAxios from 'axios-hooks';

function today() {
  return new Date().toISOString().substring(0, 10);
}

const Home = () => {
  const user = useUser()

  const [state, setState] = React.useState({
    bikes: {},
    selectedDate: today(),
    bikesAvailableOnSelectedDate: {},
    filters: {
      model: null,
      color: null,
      location: null,
      rateAvergae: null
    }
  })

  const [{
    data: result,
    loading: isGettingResult,
    error: errorGettingResult }
  ] = useAxios(
    {
      url: `/api/availableBikes/${state.selectedDate}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      data: JSON.stringify({})
    },
    { manual: false }
  )

  React.useEffect(() => {
    const bikes = {};

    if (result && result.data) {
      result.data.forEach(result => {
        bikes[result.id] = result;
      })

      setState({
        ...state,
        bikes
      })
    }
  }, [result])

  function handleSelectDate() {
    return event => {
      event && event.preventDefault();
      console.log('Selected date:', event.target.value);
      setState({
        ...state,
        selectedDate: event.target.value
      })
    }
  }

  function handleReserve(bikeId) {
    return event => {
      event && event.preventDefault();

    }
  }

  return (
    <Layout active="index">
      {user ?
        <>
          <div className="pb-2 border-b border-gray-500 flex items-center">
            <span className="flex items-center">
              <label className="mr-2">Available on</label>
              <input type="date" className="bg-gray-200 py-1 px-2" defaultValue={today()} onChange={handleSelectDate()} />
            </span>
          </div>

          {isGettingResult ? <>Loading...</> :
            <ul>
              <li className="w-full flex items-center py-2 font-bold bg-gray-100">
                <div className="h-8 w-16 px-1 py-1">
                  Bike Id
                </div>
                <div className="h-8 w-48 px-1 py-1">Model</div>
                <div className="h-8 w-20 px-1 py-1">Color</div>
                <div className="h-8 flex-1 px-1 py-1">Location</div>
                <div className="w-32 px-4 py-1"></div>
              </li>
              {state.bikes && Object.keys(state.bikes).length > 0 ?
                <>
                  {Object.keys(state.bikes).map(id => {
                    const bike = state.bikes[id];

                    return <li key={`bike-${id}`} className="w-full flex items-center py-2">
                      <div className="h-8 w-16 px-1 py-1">
                        {bike.id}
                      </div>
                      <div className="h-8 w-48 px-1 py-1">{bike.model}</div>
                      <div className="h-8 w-20 px-1 py-1">{bike.color}</div>
                      <div className="h-8 flex-1 px-1 py-1">{bike.location}</div>
                      <div className="w-40 px-4 py-1">
                        <button onClick={handleReserve(bike.id)} className="text-blue-500 hover:underline">
                          Reserve
                        </button>
                      </div>
                    </li>
                  })}
                </> : <>
                  <li className="py-2">
                    No bikes available on this date.
                  </li>
                </>}
            </ul>}
        </> :
        <>Please log in</>}
    </Layout>
  )
}

export default Home
