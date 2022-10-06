import useAxios from "axios-hooks"
import React from "react"

function today() {
    return new Date().toISOString().substring(0, 10);
}

export default function Homepage() {
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

    console.log('today', today())

    const [{
        data: result,
        loading: isGettingResult,
        error: errorGettingResult }
    ] = useAxios(
        {
            url: `/v1/bikes/availableOnDate/${state.selectedDate}`,
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

    return (
        <div className="max-w-3xl mx-auto">
            <h1>Bikes for rent</h1>

            <div className="py-2 border-b border-gray-500 flex items-center">
                <span className="flex items-center">
                    <label className="mr-2">Available on</label>
                    <input type="date" className="bg-gray-200 py-1 px-2" defaultValue={today()} />
                </span>
            </div>

            {isGettingResult ? <>Loading...</> :
                <ul>
                    <li className="w-full flex items-center py-2 font-bold">
                        <div className="h-8 w-10 px-1 py-1">
                            Id
                        </div>
                        <div className="h-8 w-48 px-1 py-1">Model</div>
                        <div className="h-8 w-20 px-1 py-1">Color</div>
                        <div className="h-8 flex-1 px-1 py-1">Location</div>
                        <div className="w-32 px-4 py-1"></div>
                    </li>
                    {state.bikes && Object.keys(state.bikes).map(id => {
                        const bike = state.bikes[id];

                        return <li key={`bike-${id}`} className="w-full flex items-center py-2">
                            <div className="h-8 w-10 px-1 py-1">
                                {bike.id}
                            </div>
                            <div className="h-8 w-48 px-1 py-1">{bike.model}</div>
                            <div className="h-8 w-20 px-1 py-1">{bike.color}</div>
                            <div className="h-8 flex-1 px-1 py-1">{bike.location}</div>
                            <div className="w-32 px-4 py-1"></div>
                        </li>
                    })}
                </ul>}
        </div>
    );
}