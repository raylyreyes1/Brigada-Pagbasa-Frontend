import Sidebar from "../components/Sidebar";
import { VictoryPie } from "victory";
import { HeadingLarge } from "baseui/typography";

function AdminDashboard() {
    console.log("Admin Dashboard loaded"); // Debugging log

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: "20px", background: "#f8f5fc" }}>
                <HeadingLarge>Admin</HeadingLarge>
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
                    <VictoryPie 
                        data={[{ x: "Male", y: 40 }, { x: "Female", y: 30 }, { x: "Other", y: 30 }]}
                        colorScale={["blue", "orange", "green"]}
                    />
                    <VictoryPie 
                        data={[{ x: "Passed", y: 70 }, { x: "Failed", y: 30 }]}
                        colorScale={["blue", "orange"]}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
