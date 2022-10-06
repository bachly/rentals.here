import useAxios from "axios-hooks"
import React from "react"

export default function AdminUsersPage() {
    const [{
        data: result,
        loading: isGettingResult,
        error: errorGettingResult }
    ] = useAxios(
        {
            url: '/v1/users',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            data: JSON.stringify({})
        },
        { manual: false }
    )

    React.useEffect(function onLoad() {

    })

    React.useEffect(function onSuccessGettingBikes() {
        if (result && result.status === "success") {
            console.log("successGettingBikes:", result.data);

        }
    }, [result])

    return (
        <>
            <h1>Admin/Users</h1>
        </>
    );
}