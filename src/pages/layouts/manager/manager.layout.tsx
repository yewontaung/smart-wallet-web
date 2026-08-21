import { Outlet } from "react-router-dom";

export default function MangerLayout() {
    return (
        <div>
            <h1>Manager</h1>
            <Outlet />
        </div>
    )
}