import { useUser } from '../lib/hooks'
import Layout from '../components/Layout'
import React from 'react';
import useAxios from 'axios-hooks';

function formatISODate(dateString) {
    const date = new Date(dateString).toLocaleDateString();
    return date;
}

const RateABikePage = () => {
    const user = useUser()

    const [state, setState] = React.useState({
        items: {},
        userIdToFetch: null,
        reservationIdToRate: null
    })

    const [{
        data: result,
        loading: isGettingResult,
        error: errorGettingResult },
        getReservationsCreatedByUser
    ] = useAxios(
        {
            url: `/api/reservationsToRate/${state.userIdToFetch}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            data: JSON.stringify({})
        },
        { manual: true }
    )

    const [{
        data: resultRating,
        loading: isRating,
        error: errorRating },
        submitRating
    ] = useAxios(
        {
            url: `/api/ratings`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            data: JSON.stringify({
                reservation_id: state.reservationIdToRate,
                rating: state.items[state.reservationIdToRate] && state.items[state.reservationIdToRate].newRating,
                comment: state.items[state.reservationIdToRate] && state.items[state.reservationIdToRate].newComment,
            })
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
            getReservationsCreatedByUser()
        }
    }, [state.userIdToFetch])

    React.useEffect(() => {
        const items = {};

        if (result && result.data) {
            result.data.forEach(result => {
                items[result.id] = {
                    ...result,
                    newRating: 5,
                    newComment: null
                }
            })

            setState({
                ...state,
                items
            })
        }
    }, [result])

    function handleSubmitRate(reservationId) {
        return event => {
            event && event.preventDefault();
            setState({
                ...state,
                reservationIdToRate: reservationId
            })
        }
    }

    function handleChangeNewRating(reservationId, field) {
        return event => {
            event && event.preventDefault();
            setState({
                ...state,
                items: {
                    ...state.items,
                    [reservationId]: {
                        ...state.items[reservationId],
                        [field]: event.target.value
                    }
                }
            })
        }
    }

    React.useEffect(() => {
        if (state.reservationIdToRate) {
            submitRating();
        }
    }, [state.reservationIdToRate])

    React.useEffect(() => {
        if (resultRating && resultRating.status === 'success') {
            const returnedItem = resultRating.data[0];
            console.log("Returned rated item:", returnedItem);

            const items = Object.assign({}, state.items);

            if (items[returnedItem.reservation_id]) {
                items[returnedItem.reservation_id].isRated = true;

                setState({
                    ...state,
                    items: {
                        ...items
                    },
                    reservationIdToRate: null
                })
            }
        }
    }, [resultRating])

    return (
        <Layout active="rateABike">

            {user ?
                <>
                    <div className="pb-2 border-b border-gray-500 flex items-center">
                        <span className="flex items-center">
                            <label className="mr-2">Please provide {Object.keys(state.items).length} rating(s) below</label>
                        </span>
                    </div>

                    {isGettingResult ? <>Loading...</> :
                        <ul>
                            <li className="w-full flex items-center py-2 font-bold bg-gray-100">
                                <div className="h-8 w-48 px-1 py-1">Your bike</div>
                                <div className="h-8 px-4 py-1">Provide your rating</div>
                            </li>
                            {state.items && Object.keys(state.items).length > 0 ?
                                <>
                                    {Object.keys(state.items).map(id => {
                                        const reservation = state.items[id];

                                        return <li key={`reservation-${id}`} className="w-full flex items-start py-2 text-sm">
                                            {reservation.isRated ?
                                                <div className="w-full flex items-start bg-green-100">
                                                    <div className="w-48 px-1 py-1">
                                                        {reservation.model} - {reservation.color} - {reservation.location}
                                                        <br /> <br />
                                                        You reserved this bike from {formatISODate(reservation.reserved_from)} to {formatISODate(reservation.reserved_to)}
                                                    </div>
                                                    <div className="px-4 py-1">
                                                        Thank you for rating.
                                                    </div>
                                                </div>
                                                : <>
                                                    <div className="h-8 w-48 px-1 py-1">
                                                        {reservation.model} - {reservation.color} - {reservation.location}
                                                        <br /> <br />
                                                        You reserved this bike from {formatISODate(reservation.reserved_from)} to {formatISODate(reservation.reserved_to)}
                                                    </div>
                                                    <div className="flex-1 px-4 py-1">

                                                        <form onSubmit={handleSubmitRate(reservation.id)}>
                                                            <select onChange={handleChangeNewRating(reservation.id, 'newRating')} className="w-32 bg-gray-200 py-1 px-2">
                                                                <option value="5">★★★★★</option>
                                                                <option value="4">★★★★</option>
                                                                <option value="3">★★★</option>
                                                                <option value="2">★★</option>
                                                                <option value="1">★</option>
                                                            </select>
                                                            <textarea onChange={handleChangeNewRating(reservation.id, 'newComment')} className="mt-2 w-full bg-gray-200 h-24 py-1 px-2 text-sm" placeholder="Add your comment (optional)" />
                                                            <button type="submit" className="block bg-blue-500 py-1 px-2 text-sm text-white rounded-sm hover:bg-blue-600">
                                                                Submit
                                                            </button>
                                                        </form>
                                                    </div>
                                                </>}
                                        </li>
                                    })}
                                </> : <>
                                    No reservations.
                                </>}
                        </ul>}
                </> :
                <>Please log in</>}
        </Layout>
    )
}

export default RateABikePage
