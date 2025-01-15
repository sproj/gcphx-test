import { useLocation } from "react-router"

export const TableContainer: React.FC<{}> = () => {
    const location = useLocation()
    console.log(location)
    return (
        <div>{location.pathname}</div>
    )
}
