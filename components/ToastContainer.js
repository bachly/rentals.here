export default function ({ children }) {
    return <div className="fixed bottom-0 w-full flex flex-col-reverse">
        {children}
    </div>
}