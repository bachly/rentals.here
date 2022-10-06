import useAxios from "axios-hooks"
import React from "react"

export default function AdminHomePage() {
    const [state, setState] = React.useState({
        items: null,
        currentEditItems: null
    })

    const [{
        data: result,
        loading: isGettingResult,
        error: errorGettingResult }
    ] = useAxios(
        {
            url: '/v1/bikes',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            data: JSON.stringify({})
        },
        { manual: false }
    )

    const [{
        data: resultUpdating,
        loading: isUpdating,
        error: errorUpdating },
        saveItem
    ] = useAxios(
        {
            url: `/v1/bikes/${state.idToSave}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            useCache: false,
            data: state.currentEditItems ? JSON.stringify(state.currentEditItems[state.idToSave]) : JSON.stringify({})
        },
        { manual: true }
    )

    function handleEdit(id) {
        return event => {
            event && event.preventDefault();
            setState({
                ...state,
                currentEditItems: {
                    ...state.currentEditItems,
                    [id]: Object.assign({}, state.items[id])
                }
            })
        }
    }

    function handleCancel(id) {
        return event => {
            event && event.preventDefault();
            const currentEditItems = Object.assign({}, state.currentEditItems);
            delete currentEditItems[id];

            setState({
                ...state,
                currentEditItems
            })
        }
    }

    function handleChange(id, field) {
        return event => {
            event && event.preventDefault();
            setState({
                ...state,
                currentEditItems: {
                    ...state.currentEditItems,
                    [id]: {
                        ...state.currentEditItems[id],
                        [field]: event.target.value
                    }
                }
            })
        }
    }

    function handleSave(id) {
        return event => {
            event && event.preventDefault();
            setState({
                ...state,
                idToSave: id
            })
        }
    }

    React.useEffect(() => {
        const items = {};

        if (result && result.data) {
            result.data.forEach(result => {
                items[result.id] = result;
            })

            setState({
                ...state,
                items
            })
        }
    }, [result])

    React.useEffect(() => {
        if (state.currentEditItems && state.idToSave) {
            console.log("Updating:", state.currentEditItems[state.idToSave]);
            saveItem();
        }
    }, [state.idToSave])

    React.useEffect(() => {
        if (resultUpdating && resultUpdating.status === 'success') {
            const returnedUpdatedItem = resultUpdating.data[0];
            console.log("Returned updated item:", returnedUpdatedItem);

            const currentEditItems = Object.assign({}, state.currentEditItems);
            delete currentEditItems[returnedUpdatedItem.id];

            setState({
                ...state,
                items: {
                    ...state.items,
                    [returnedUpdatedItem.id]: {
                        ...state.items[returnedUpdatedItem.id],
                        ...returnedUpdatedItem
                    }
                },
                currentEditItems
            })
        }
    }, [resultUpdating])

    return (
        <div className="max-w-3xl mx-auto">
            <h1>Admin/Bikes</h1>
            {isGettingResult ? <>Loading...</> :
                <>
                    {state.items && Object.keys(state.items).length > 0 &&
                        <ul className="max-w-3xl mx-auto">
                            {Object.keys(state.items).map(id => {
                                if (state.currentEditItems && state.currentEditItems[id]) {
                                    const currentEditItem = state.currentEditItems[id];

                                    return <li key={`item-${currentEditItem.id}`} className="w-full py-2">
                                        <form onSubmit={handleSave(currentEditItem.id)} className="flex items-center">
                                            <div className="w-10 px-1">
                                                {currentEditItem.id}
                                            </div>

                                            <div className="w-48 px-1">
                                                <input onChange={handleChange(currentEditItem.id, 'model')} className="w-full h-8 px-2 bg-gray-200 inner-shadow" defaultValue={currentEditItem.model} />
                                            </div>
                                            <div className="w-20 px-1">
                                                <input onChange={handleChange(currentEditItem.id, 'color')} className="w-full h-8 px-2 bg-gray-200 inner-shadow" defaultValue={currentEditItem.color} />
                                            </div>
                                            <div className="flex-1 px-1">
                                                <input onChange={handleChange(currentEditItem.id, 'location')} className="w-full h-8 px-2 bg-gray-200 inner-shadow" defaultValue={currentEditItem.location} />
                                            </div>
                                            <div className="flex-1 px-1">
                                                <select onChange={handleChange(currentEditItem.id, 'active')} defaultValue={currentEditItem.active} className="w-full h-8 bg-gray-200 inner-shadow">
                                                    <option value={true}>Available</option>
                                                    <option value={false}>Not available</option>
                                                </select>
                                            </div>

                                            <div className="w-32 px-4">
                                                <button type="submit" onClick={handleSave(currentEditItem.id)} className="text-blue-500 hover:underline">
                                                    Save
                                                </button>
                                                <button onClick={handleCancel(currentEditItem.id)} className="ml-2 text-blue-500 hover:underline">
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </li>
                                } else {
                                    const item = state.items[id];

                                    return <li key={`item-${id}`} className="w-full flex items-center py-2">
                                        <div className="h-8 w-10 px-1 py-1">
                                            {item.id}
                                        </div>
                                        <div className="h-8 w-48 px-1 py-1">{item.model}</div>
                                        <div className="h-8 w-20 px-1 py-1">{item.color}</div>
                                        <div className="h-8 flex-1 px-1 py-1">{item.location}</div>
                                        <div className="h-8 flex-1 px-1 py-1">{item.active ? <span className="text-green-500">Availabe</span> : <span className="text-red-500">Not Available</span>}</div>
                                        <div className="w-32 px-4 py-1">
                                            <button onClick={handleEdit(item.id)} className="text-blue-500 hover:underline">
                                                Edit
                                            </button>
                                        </div>
                                    </li>
                                }
                            })}
                        </ul>
                    }
                </>
            }
        </div >
    )
}