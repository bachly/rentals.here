import clsx from "clsx";
import React from "react";

export default function Toast({ content, isSuccess = 1 }) {
    const [state, setState] = React.useState({
        class: 'animate-toast-in'
    })

    React.useEffect(() => {
        let timer;

        if (state.class === 'animate-toast-in') {
            timer = setTimeout(() => {
                setState({
                    ...state,
                    class: 'animate-toast-out'
                })
            }, 2000);
            return () => clearTimeout(timer);
        } if (state.class === 'animate-toast-out') {
            timer = setTimeout(() => {
                setState({
                    ...state,
                    class: 'hidden'
                })
            }, 2000);
            return () => clearTimeout(timer);
        }

    }, [state.class]);

    return <div className={state.class}>
        <div className={clsx(`max-w-sm mx-auto text-white py-2 px-4 mb-2 rounded-md`, isSuccess ? `bg-green-600` : `bg-red-600`)}>
            {content}
        </div>
    </div>
}