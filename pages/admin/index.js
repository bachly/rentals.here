import useAxios from "axios-hooks"
import React from "react"
import AdminHeader from "../../components/HeaderAdmin"

const BASE_URL = '/api/bikes';

export default function AdminHomePage() {
    const [state, setState] = React.useState({
        items: null,
        currentEditItems: null,
        currentDeleteItems: null
    })

    const [{
        data: result,
        loading: isGettingResult,
        error: errorGettingResult }
    ] = useAxios(
        {
            url: `${BASE_URL}`,
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
        updateItem
    ] = useAxios(
        {
            url: `${BASE_URL}/${state.idToUpdate}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            useCache: false,
            data: state.currentEditItems ? JSON.stringify(state.currentEditItems[state.idToUpdate]) : JSON.stringify({})
        },
        { manual: true }
    )

    const [{
        data: resultCreating,
        loading: isCreating,
        error: errorCreating },
        createItem
    ] = useAxios(
        {
            url: `${BASE_URL}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            useCache: false,
            data: state.currentEditItems ? JSON.stringify(state.currentEditItems[0]) : JSON.stringify({})
        },
        { manual: true }
    )

    const [{
        data: resultDeleting,
        loading: isDeleting,
        error: errorDeleting },
        deleteItem
    ] = useAxios(
        {
            url: `${BASE_URL}/${state.idToDelete}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            useCache: false,
            data: JSON.stringify({})
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
                currentEditItems,
                idToUpdate: null
            })
        }
    }

    function handleChange(id, field) {
        return event => {
            event && event.preventDefault();

            const items = state.currentEditItems || {};
            items[id] = items[id] || {};
            items[id] = {
                ...items[id],
                [field]: event.target.value
            }

            setState({
                ...state,
                currentEditItems: {
                    ...state.currentEditItems,
                    ...items
                }
            })
        }
    }

    function handleSave(id) {
        return event => {
            event && event.preventDefault();
            setState({
                ...state,
                idToUpdate: id
            })
        }
    }

    function handleDelete(id) {
        return event => {
            event && event.preventDefault();
            setState({
                ...state,
                currentDeleteItems: {
                    ...state.currentDeleteItems,
                    [id]: Object.assign({}, state.items[id])
                }
            })
        }
    }

    function handleCancelDelete(id) {
        return event => {
            event && event.preventDefault();
            const currentDeleteItems = Object.assign({}, state.currentDeleteItems);
            delete currentDeleteItems[id];

            setState({
                ...state,
                currentDeleteItems,
                idToDelete: null
            })
        }
    }

    function handleConfirmDelete(id) {
        return event => {
            event && event.preventDefault();
            setState({
                ...state,
                idToDelete: id
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

    // updating

    React.useEffect(() => {
        if (state.currentEditItems && state.idToUpdate !== null && !isNaN(state.idToUpdate)) {
            if (state.idToUpdate === 0) {
                if (state.currentEditItems[0]) {
                    console.log("Creating:", state.currentEditItems[0]);
                    createItem();
                } else {
                    console.warn("Creating: [empty item]");
                }
            } else {
                if (state.currentEditItems[state.idToUpdate]) {
                    console.log("Updating:", state.currentEditItems[state.idToUpdate]);
                    updateItem();
                } else {
                    console.warn("Updating: [empty item]");
                }
            }
        }
    }, [state.idToUpdate])

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
                currentEditItems,
                idToUpdate: null
            })
        }
    }, [resultUpdating])

    // deleting

    React.useEffect(() => {
        if (state.currentDeleteItems && state.idToDelete !== null && !isNaN(state.idToDelete)) {
            if (state.currentDeleteItems[state.idToDelete]) {
                console.log("Deleting:", state.currentDeleteItems[state.idToDelete]);
                deleteItem();
            } else {
                console.warn("Deleting: [empty item]");
            }
        }
    }, [state.idToDelete])

    React.useEffect(() => {
        if (resultDeleting && resultDeleting.status === 'success') {
            const returnedDeletedItem = resultDeleting.data[0];
            console.log("Returned deleted item:", returnedDeletedItem);

            const currentDeleteItems = Object.assign({}, state.currentEditItems);
            delete currentDeleteItems[returnedDeletedItem.id];

            const items = Object.assign({}, state.items);
            delete items[returnedDeletedItem.id];

            setState({
                ...state,
                items: {
                    ...items
                },
                currentDeleteItems: currentDeleteItems,
                idToDelete: null
            })
        }
    }, [resultDeleting])

    React.useEffect(() => {
        if (resultCreating && resultCreating.status === 'success') {
            const returnedCreatedItem = resultCreating.data[0];
            console.log("Returned created item:", returnedCreatedItem);

            const currentEditItems = Object.assign({}, state.currentEditItems);
            delete currentEditItems[0];

            setState({
                ...state,
                items: {
                    ...state.items,
                    [returnedCreatedItem.id]: {
                        ...state.items[returnedCreatedItem.id],
                        ...returnedCreatedItem
                    }
                },
                currentEditItems,
                idToUpdate: null
            })
        }
    }, [resultCreating])

    return (
        <>
            <AdminHeader active="index" />

            <div className="max-w-3xl mx-auto">
                {isGettingResult ? <>Loading...</> :
                    <>
                        {state.items && Object.keys(state.items).length > 0 &&
                            <ul className="mt-8">

                                <li className="bg-blue-50 w-full py-2">
                                    <form onSubmit={handleSave(0)} className="flex items-center">
                                        <div className="w-10 px-1">

                                        </div>

                                        <div className="w-48 px-1">
                                            <input onChange={handleChange(0, 'model')} className="w-full h-8 px-2 bg-white inner-shadow" placeholder="model" value={state.currentEditItems && state.currentEditItems[0]?.model || ""} />
                                        </div>
                                        <div className="w-20 px-1">
                                            <input onChange={handleChange(0, 'color')} className="w-full h-8 px-2 bg-white inner-shadow" placeholder="color" value={state.currentEditItems && state.currentEditItems[0]?.color || ""} />
                                        </div>
                                        <div className="px-1">
                                            <input onChange={handleChange(0, 'location')} className="w-full h-8 px-2 bg-white inner-shadow" placeholder="location" value={state.currentEditItems && state.currentEditItems[0]?.location || ""} />
                                        </div>
                                        <div className="flex-1 px-1"></div>

                                        <div className="w-40 px-4">
                                            <button type="submit" className="text-blue-500 hover:underline">
                                                Add new
                                            </button>
                                        </div>
                                    </form>
                                    {errorCreating && <span className="text-red-500 px-12">Error creating new item</span>}
                                </li>

                                {Object.keys(state.items).map(id => {
                                    if (state.currentEditItems && state.currentEditItems[id]) {
                                        const currentEditItem = state.currentEditItems[id];

                                        return <li key={`item-${currentEditItem.id}`} className="w-full py-2 bg-yellow-200">
                                            <form onSubmit={handleSave(currentEditItem.id)} className="flex items-center">
                                                <div className="w-10 px-1">
                                                    {currentEditItem.id}
                                                </div>

                                                <div className="w-48 px-1">
                                                    <input onChange={handleChange(currentEditItem.id, 'model')} className="w-full h-8 px-2 bg-white inner-shadow" defaultValue={currentEditItem.model} />
                                                </div>
                                                <div className="w-20 px-1">
                                                    <input onChange={handleChange(currentEditItem.id, 'color')} className="w-full h-8 px-2 bg-white inner-shadow" defaultValue={currentEditItem.color} />
                                                </div>
                                                <div className="flex-1 px-1">
                                                    <input onChange={handleChange(currentEditItem.id, 'location')} className="w-full h-8 px-2 bg-white inner-shadow" defaultValue={currentEditItem.location} />
                                                </div>
                                                <div className="flex-1 px-1">
                                                    <select onChange={handleChange(currentEditItem.id, 'active')} defaultValue={currentEditItem.active} className="w-full h-8 bg-white inner-shadow">
                                                        <option value={true}>Available</option>
                                                        <option value={false}>Not available</option>
                                                    </select>
                                                </div>

                                                <div className="w-40 px-4">
                                                    <button type="submit" onClick={handleSave(currentEditItem.id)} className="text-blue-500 hover:underline">
                                                        Save
                                                    </button>
                                                    <button onClick={handleCancel(currentEditItem.id)} className="ml-4 text-blue-500 hover:underline">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </li>
                                    } else {
                                        if (state.currentDeleteItems && state.currentDeleteItems[id]) {
                                            const currentDeleteItem = state.currentDeleteItems[id];

                                            return <li key={`item-${id}`} className="w-full flex items-center py-2 bg-red-50">
                                                <div className="h-8 w-10 px-1 py-1 line-through">
                                                    {currentDeleteItem.id}
                                                </div>
                                                <div className="h-8 w-48 px-1 py-1 line-through text-gray-400">{currentDeleteItem.model}</div>
                                                <div className="h-8 w-20 px-1 py-1 line-through">{currentDeleteItem.color}</div>
                                                <div className="h-8 flex-1 px-1 py-1 line-through">{currentDeleteItem.location}</div>
                                                <div className="h-8 flex-1 px-1 py-1 line-through">{currentDeleteItem.active ? <span className="text-green-500">Available</span> : <span className="text-red-500">Not Available</span>}</div>
                                                <div className="w-40 px-4 py-1">
                                                    <button onClick={handleConfirmDelete(currentDeleteItem.id)} className="text-red-500 hover:underline">
                                                        Delete
                                                    </button>
                                                    <button onClick={handleCancelDelete(currentDeleteItem.id)} className="ml-4 text-blue-500 hover:underline">
                                                        Cancel
                                                    </button>
                                                </div>
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
                                                <div className="w-40 px-4 py-1">
                                                    <button onClick={handleEdit(item.id)} className="text-blue-500 hover:underline">
                                                        Edit
                                                    </button>
                                                    <button onClick={handleDelete(item.id)} className="ml-4 text-blue-500 hover:underline">
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        }
                                    }
                                })}
                            </ul>
                        }
                    </>
                }
            </div>
        </>
    )
}