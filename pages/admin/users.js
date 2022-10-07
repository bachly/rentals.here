import useAxios from "axios-hooks"
import React from "react"
import AdminHeader from "../../components/HeaderAdmin"

const BASE_URL = '/api/users';

export default function AdminUsersPage() {
    const [state, setState] = React.useState({
        items: null,
        currentEditItems: null,
        currentDeleteItems: null
    })

    const [{
        data: result,
        loading: isGettingResult,
        error: errorGettingResult },
        getUsers
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
            data: state.currentEditItems && state.currentEditItems[state.idToUpdate] ? JSON.stringify({
                username: state.currentEditItems[state.idToUpdate].username,
                password: state.currentEditItems[state.idToUpdate].password,
                roles: state.currentEditItems[state.idToUpdate].roles,
                active: true
            }) : JSON.stringify({})
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
            data: state.currentEditItems && state.currentEditItems[0] ? JSON.stringify({
                username: state.currentEditItems[0].username,
                password: state.currentEditItems[0].password,
                roles: state.currentEditItems[0].roles || '',
                active: true
            }) : JSON.stringify({})
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
                items[result.id] = items[result.id] || {};
                items[result.id] = {
                    ...items[result.id],
                    ...result,
                }

                items[result.id].reservations = items[result.id].reservations || {};

                if (result.reservation_id) {
                    items[result.id].reservations[result.reservation_id] = {
                        reservation_id: result.reservation_id,
                        bike_id: result.bike_id,
                        model: result.model,
                        color: result.color,
                        location: result.location,
                        reserved_from: result.reserved_from,
                        reserved_to: result.reserved_to
                    }
                }
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
            const currentEditItems = Object.assign({}, state.currentEditItems);
            delete currentEditItems[0];

            setState({
                ...state,
                currentEditItems,
                idToUpdate: null
            })
            getUsers();
        }
    }, [resultCreating])

    return (
        <>
            <AdminHeader active="users" />

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
                                            <input onChange={handleChange(0, 'username')} className="w-full h-8 px-2 bg-white inner-shadow" placeholder="username" value={state.currentEditItems && state.currentEditItems[0]?.username || ""} />
                                        </div>
                                        <div className="w-48 px-1">
                                            <input onChange={handleChange(0, 'password')} className="w-full h-8 px-2 bg-white inner-shadow" placeholder="password" value={state.currentEditItems && state.currentEditItems[0]?.password || ""} />
                                        </div>
                                        <div className="w-48 px-1">
                                            <input onChange={handleChange(0, 'roles')} className="w-full h-8 px-2 bg-white inner-shadow" placeholder="roles" value={state.currentEditItems && state.currentEditItems[0]?.roles || ""} />
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

                                        return <li key={`item-${currentEditItem.id}`} className="w-full py-2 bg-yellow-200 border-t border-gray-400">
                                            <form onSubmit={handleSave(currentEditItem.id)} className="flex items-center">
                                                <div className="w-10 px-1">
                                                    {currentEditItem.id}
                                                </div>

                                                <div className="flex-1 px-1">
                                                    <input onChange={handleChange(currentEditItem.id, 'username')} className="w-full h-8 px-2 bg-white inner-shadow" defaultValue={currentEditItem.username} placeholder="username" />
                                                </div>
                                                <div className="w-48 px-1">
                                                    <input onChange={handleChange(currentEditItem.id, 'password')} className="w-full h-8 px-2 bg-white inner-shadow" defaultValue={currentEditItem.password} placeholder="password" />
                                                </div>
                                                <div className="w-48 px-1">
                                                    <input onChange={handleChange(currentEditItem.id, 'roles')} className="w-full h-8 px-2 bg-white inner-shadow" defaultValue={currentEditItem.roles} placeholder="roles" />
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

                                            return <li key={`item-${id}`} className="w-full flex items-center py-2 bg-red-50 border-t border-gray-400">
                                                <div className="h-8 w-10 px-1 py-1 line-through">
                                                    {currentDeleteItem.id}
                                                </div>
                                                <div className="h-8 flex-1 px-1 py-1 line-through text-gray-400">{currentDeleteItem.username}</div>
                                                <div className="h-8 w-48 px-1 py-1 line-through">***********</div>
                                                <div className="h-8 w-48 px-1 py-1 line-through">{currentDeleteItem.roles}</div>
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

                                            return <li key={`item-${id}`} className="w-full">
                                                <div className="flex items-center py-2 border-t border-gray-400">
                                                    <div className="h-8 w-10 px-1 py-1">
                                                        {item.id}
                                                    </div>
                                                    <div className="h-8 flex-1 px-1 py-1">
                                                        {item.username}
                                                    </div>
                                                    <div className="h-8 w-48 px-1 py-1">***********</div>
                                                    <div className="h-8 w-48 px-1 py-1">{item.roles}</div>
                                                    <div className="w-40 px-4 py-1">
                                                        <button onClick={handleEdit(item.id)} className="text-blue-500 hover:underline">
                                                            Edit
                                                        </button>
                                                        <button onClick={handleDelete(item.id)} className="ml-4 text-blue-500 hover:underline">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                {Object.keys(item.reservations).length > 0 ?
                                                    <div className="bg-gray-100 shadow-inner pt-2 pb-4 px-10 text-sm">
                                                        <div className="font-bold text-gray-400 mt-2">Reservations</div>
                                                        <div className="flex items-center border-t border-gray-300 py-1">
                                                            <div className="w-6">Id</div>
                                                            <div className="w-16">Bike Id</div>
                                                            <div className="w-20">Model</div>
                                                            <div className="w-12">Color</div>
                                                            <div className="w-28">Location</div>
                                                            <div className="w-28">From</div>
                                                            <div className="w-28">To</div>
                                                        </div>
                                                        {Object.keys(item.reservations).map(reservation_id => {
                                                            const reservation = item.reservations[reservation_id];
                                                            return <div key={`reservation-${reservation_id}`} className="flex items-center border-t border-gray-300 py-1">
                                                                <div className="w-6">{reservation.reservation_id}</div>
                                                                <div className="w-16">{reservation.bike_id}</div>
                                                                <div className="w-20">{reservation.model}</div>
                                                                <div className="w-12">{reservation.color}</div>
                                                                <div className="w-28">{reservation.location}</div>
                                                                <div className="w-28">{formatISODate(reservation.reserved_from)}</div>
                                                                <div className="w-28">{formatISODate(reservation.reserved_to)}</div>
                                                            </div>
                                                        })}
                                                    </div> : <div className="bg-gray-100 shadow-inner pt-2 pb-4 px-10 text-sm">
                                                    <div className=" text-gray-400 mt-2">No reservations.</div>
                                                    </div>}
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

function formatISODate(dateString) {
    const date = new Date(dateString).toLocaleDateString();
    return date;
}