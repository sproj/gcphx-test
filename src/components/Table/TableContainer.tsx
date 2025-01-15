import { useLocation } from "react-router"

export const TableContainer: React.FC<{}> = () => {
    const location = useLocation()

    return (
        <div>{location.pathname}</div>
    )
}