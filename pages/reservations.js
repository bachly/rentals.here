import { useUser } from '../lib/hooks'
import Layout from '../components/Layout'
import React from 'react';
import useAxios from 'axios-hooks';

function formatISODate(dateString) {
    const date = new Date(dateString).toISOString();
    return date.substring(0, 10);
}

const ReservationsPage = () => {
    const user = useUser()

    const [state, setState] = React.useState({
        reservations: {},
        userIdToFetch: null
    })

    const [{
        data: result,
        loading: isGettingResult,
        error: errorGettingResult },
        getReservationsByUser
    ] = useAxios(
        {
            url: `/api/reservationsByUser/${state.userIdToFetch}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            data: JSON.stringify({})
        },
        { manual: true }
    )

    React.useEffect(() => {
        if (user && user.id) {
            setState({
                ...state,
                userIdToFetch: user.id
            })
        }
    }, [user])

    React.useEffect(() => {
        if (state.userIdToFetch) {
            getReservationsByUser()
        }
    }, [state.userIdToFetch])

    React.useEffect(() => {
        const reservations = {};

        if (result && result.data) {
            result.data.forEach(result => {
                reservations[result.id] = result;
            })

            setState({
                ...state,
                reservations
            })
        }
    }, [result])

    function handleCancel(reservationId) {
        return event => {
            event && event.preventDefault();

        }
    }

    return (
        <Layout active="reservations">
            {user ?
                <>
                    <div className="pb-2 border-b border-gray-500 flex items-center">
                        <span className="flex items-center">
                            <label className="mr-2">You have {Object.keys(state.reservations).length} reservations</label>
                        </span>
                    </div>

                    {isGettingResult ? <>Loading...</> :
                        <ul>
                            <li className="w-full flex items-center py-2 font-bold bg-gray-100">
                                <div className="h-8 w-10 px-1 py-1">
                                    Id
                                </div>
                                <div className="h-8 w-16 px-1 py-1">Bike Id</div>
                                <div className="h-8 w-20 px-1 py-1">Model</div>
                                <div className="h-8 w-16 px-1 py-1">Color</div>
                                <div className="h-8 flex-1 px-1 py-1">Location</div>
                                <div className="h-8 w-28 px-1 py-1">From</div>
                                <div className="h-8 w-28 px-1 py-1">To</div>
                                <div className="w-32 px-4 py-1"></div>
                            </li>
                            {state.reservations && Object.keys(state.reservations).map(id => {
                                const reservation = state.reservations[id];

                                return <li key={`reservation-${id}`} className="w-full flex items-center py-2">
                                    <div className="h-8 w-10 px-1 py-1">
                                        {reservation.id}
                                    </div>
                                    <div className="h-8 w-16 px-1 py-1">{reservation.bike_id}</div>
                                    <div className="h-8 w-20 px-1 py-1">{reservation.model}</div>
                                    <div className="h-8 w-16 px-1 py-1">{reservation.color}</div>
                                    <div className="h-8 flex-1 px-1 py-1">{reservation.location}</div>
                                    <div className="h-8 w-28 px-1 py-1">{formatISODate(reservation.reserved_from)}</div>
                                    <div className="h-8 w-28 px-1 py-1">{formatISODate(reservation.reserved_to)}</div>
                                    <div className="w-40 px-4 py-1">
                                        <button onClick={handleCancel(reservation.id)} className="text-blue-500 hover:underline">
                                            Cancel
                                        </button>
                                    </div>
                                </li>
                            })}
                        </ul>}
                </> :
                <>Please log in</>}
        </Layout>
    )
}

export default ReservationsPage
