import { useUser } from '../lib/hooks'
import Layout from '../components/Layout'
import React from 'react';
import useAxios from 'axios-hooks';
import { differenceInDays } from 'date-fns';
import _ from 'underscore';

function today() {
  return new Date().toISOString().substring(0, 10);
}

const Home = () => {
  const user = useUser()

  const fromDateInputRef = React.createRef();
  const toDateInputRef = React.createRef();

  const [state, setState] = React.useState({
    bikes: {},
    filteredBikes: {},
    selectedFromDate: today(),
    selectedToDate: today(),
    reservationDuration: 1,
    bikesAvailableOnSelectedDate: {},
    filters: {
      model: null,
      color: null,
      location: null,
    },
    bikeIdToReserve: null
  })

  const [{
    data: result,
    loading: isGettingResult,
    error: errorGettingResult },
    getAvailableBikes
  ] = useAxios(
    {
      url: `/api/availableBikes/${state.selectedFromDate}_${state.selectedToDate}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      useCache: false,
      data: JSON.stringify({})
    },
    { manual: false }
  )

  const [{
    data: resultCreatingReservation,
    loading: isCreatingReservation,
    error: errorCreatingReservation },
    createReservation
  ] = useAxios(
    {
      url: `/api/reservations`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      data: JSON.stringify({
        user_id: user && user.id,
        bike_id: state.bikeIdToReserve,
        reserved_from: state.selectedFromDate,
        reserved_to: state.selectedToDate,
        active: true
      })
    },
    { manual: true }
  )

  React.useEffect(() => {
    const bikes = {};

    if (result && result.data) {
      result.data.forEach(result => {
        bikes[result.id] = result;
      })

      setState({
        ...state,
        bikes,
        filteredBikes: bikes
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
      setState({
        ...state,
        bikeIdToReserve: bikeId
      })
    }
  }

  function handleChangeFilter(filter) {
    return event => {
      event && event.preventDefault();
      setState({
        ...state,
        filters: {
          ...state.filters,
          [filter]: event.target.value.toLowerCase()
        }
      })
    }
  }

  React.useEffect(() => {
    if (fromDateInputRef && fromDateInputRef.current) {
      fromDateInputRef.current.value = state.selectedFromDate;
    }

    if (toDateInputRef && toDateInputRef.current) {
      toDateInputRef.current.value = state.selectedToDate;
    }

    getAvailableBikes();
  }, [
    state.selectedFromDate,
    state.selectedToDate
  ])

  React.useEffect(() => {
    if (state.bikeIdToReserve && user.id && state.selectedFromDate && state.selectedToDate) {
      createReservation();
    }
  }, [state.bikeIdToReserve, user])

  React.useEffect(() => {
    getAvailableBikes();
  }, [resultCreatingReservation])

  React.useEffect(() => {
    const result = Object.keys(state.bikes).map(id => state.bikes[id]);
    let filteredBikes = {};

    result.map((bike, index) => {
      const model = bike.model.toLowerCase();
      const color = bike.color.toLowerCase();
      const location = bike.location.toLowerCase();

      if (state.filters.model && model.indexOf(state.filters.model) === -1) {
        result[index] = null;
      }

      if (state.filters.color && color.indexOf(state.filters.color) === -1) {
        result[index] = null;
      }

      if (state.filters.location && location.indexOf(state.filters.location) === -1) {
        result[index] = null;
      }
    })

    _.compact(result).forEach(r => {
      filteredBikes[r.id] = r;
    })

    setState({
      ...state,
      filteredBikes
    })
  }, [state.filters])

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
              <li className="w-full flex items-center py-1 bg-gray-200 shadow-inner">
                <div className="h-8 w-16 px-1 py-1 text-sm flex items-center">
                  Filter by
                </div>
                <div className="h-8 w-48 px-1 py-1">
                  <input type="text" onChange={handleChangeFilter('model')} className="border border-gray-300 px-2 w-full text-sm" placeholder="Model" />
                </div>
                <div className="h-8 w-20 px-1 py-1">
                  <input type="text" onChange={handleChangeFilter('color')} className="border border-gray-300 px-2 w-full text-sm" placeholder="Color" />
                </div>
                <div className="h-8 flex-1 px-1 py-1">
                  <input type="text" onChange={handleChangeFilter('location')} className="border border-gray-300 px-2 w-full text-sm" placeholder="Location" />
                </div>
                <div className="flex-1 px-4 py-1"></div>
              </li>
              {state.filteredBikes && Object.keys(state.filteredBikes).length > 0 ?
                <>
                  {Object.keys(state.filteredBikes).map(id => {
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
