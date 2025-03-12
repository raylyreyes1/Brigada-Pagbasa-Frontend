import Sidebar from "../components/Sidebar";
import { HeadingLarge } from "baseui/typography";

function Dashboard() {
    console.log("Dashboard loaded"); // Debugging log

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: "20px", background: "#f8f5fc" }}>
                <HeadingLarge>Volunteer</HeadingLarge>
            </div>
        </div>
    );
}

export default Dashboard;
