import { useUser } from '../lib/hooks'
import Layout from '../components/Layout'
import React from 'react';
import useAxios from 'axios-hooks';
import { differenceInDays } from 'date-fns';

function today() {
  return new Date().toISOString().substring(0, 10);
}

const Home = () => {
  const user = useUser()

  const fromDateInputRef = React.createRef();
  const toDateInputRef = React.createRef();

  const [state, setState] = React.useState({
    bikes: {},
    selectedFromDate: today(),
    selectedToDate: today(),
    reservationDuration: 1,
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
      url: `/api/availableBikes/${state.selectedFromDate}_${state.selectedToDate}`,
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

  function handleSelectFromDate() {
    return event => {
      event && event.preventDefault();
      const fromDate = event.target.value;
      const toDate = new Date(state.selectedToDate) < new Date(fromDate) ? fromDate : state.selectedToDate;
      setState({
        ...state,
        selectedFromDate: fromDate,
        selectedToDate: toDate,
        reservationDuration: differenceInDays(new Date(toDate), new Date(fromDate)) + 1
      })
    }
  }

  function handleSelectToDate() {
    return event => {
      event && event.preventDefault();
      const toDate = event.target.value;
      const fromDate = new Date(state.selectedFromDate) > new Date(toDate) ? toDate : state.selectedFromDate;
      setState({
        ...state,
        selectedToDate: toDate,
        selectedFromDate: fromDate,
        reservationDuration: differenceInDays(new Date(toDate), new Date(fromDate)) + 1
      })
    }
  }

  function handleReserve(bikeId) {
    return event => {
      event && event.preventDefault();

    }
  }

  React.useEffect(() => {
    if (fromDateInputRef && fromDateInputRef.current) {
      fromDateInputRef.current.value = state.selectedFromDate;
    }

    if (toDateInputRef && toDateInputRef.current) {
      toDateInputRef.current.value = state.selectedToDate;
    }
  }, [
    state.selectedFromDate,
    state.selectedToDate
  ])

  return (
    <Layout active="index">
      {user ?
        <>
          <div className="pb-2 border-b border-gray-500 flex items-center">
            <span className="flex items-center">
              <label className="mr-2">Available from</label>
              <input ref={fromDateInputRef} type="date" className="bg-gray-200 py-1 px-2" defaultValue={state.selectedFromDate} onChange={handleSelectFromDate()} />
            </span>
            <span className="flex items-center">
              <label className="mx-2">to</label>
              <input ref={toDateInputRef} type="date" className="bg-gray-200 py-1 px-2" defaultValue={state.selectedToDate} onChange={handleSelectToDate()} />
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
                <div className="flex-1 px-4 py-1"></div>
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
                      <div className="flex-1 px-4 py-1">
                        <button onClick={handleReserve(bike.id)} className="text-blue-500 hover:underline">
                          Reserve for {state.reservationDuration} day(s)
                        </button>
                      </div>
                    </li>
                  })}
                </> : <>
                  <li className="py-2">
                    No bikes available in this period.
                  </li>
                </>}
            </ul>}
        </> :
        <>Please log in</>}
    </Layout>
  )
}

export default Home
