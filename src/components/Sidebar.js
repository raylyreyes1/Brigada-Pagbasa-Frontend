import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTachometerAlt, FaUserEdit, FaList, FaSignOutAlt } from "react-icons/fa"; 

function Sidebar() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const menuItems = [
        ...(user && user.role === "user" ? [
            { title: "Dashboard", path: "/dashboard", icon: <FaList /> },
            { title: "Profile", path: "/profile", icon: <FaUserEdit /> },
        ] : []),
        ...(user && user.role === "admin" ? [
            { title: "Edit Assessments", path: "/admin-dashboard", icon: <FaList /> },
            { title: "Student Statistics", path: "/statistics", icon: <FaTachometerAlt /> },
        ] : []),
        { title: "Logout", path: "/logout", icon: <FaSignOutAlt /> }
    ];

    return (
        <div style={{
            width: collapsed ? "60px" : "250px",
            height: "100vh",
            background: "#1e1e1e",
            color: "#fff",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily: "'Poppins', sans-serif",
            transition: "width 0.3s ease-in-out",
            overflow: "hidden"
        }}>
            <div>
                <button 
                    style={{
                        background: "none",
                        border: "none",
                        color: "#fff",
                        fontSize: "20px",
                        cursor: "pointer",
                        marginBottom: "20px",
                        width: "100%",
                        textAlign: "center"
                    }}
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <FaBars />
                </button>

                <ul style={{ listStyle: "none", padding: 0 }}>
                    {menuItems.map((item, index) => (
                        <li key={index} style={{
                            padding: "12px",
                            cursor: "pointer",
                            transition: "0.3s",
                            fontSize: "16px",
                            borderRadius: "5px",
                            marginBottom: "8px",
                            textAlign: collapsed ? "center" : "left",
                            backgroundColor: item.path === "/logout" ? "#fff" : "transparent",
                            color: item.path === "/logout" ? "#000" : "#fff",
                            fontWeight: item.path === "/logout" ? "bold" : "normal",
                            fontFamily: "'Poppins', sans-serif",
                            display: "flex",
                            alignItems: "center",
                            gap: collapsed ? "0" : "10px",
                            justifyContent: collapsed ? "center" : "flex-start"
                        }} onClick={() => {
                            if (item.path === "/logout") {
                                localStorage.removeItem("user");
                                navigate("/");
                            } else {
                                navigate(item.path);
                            }
                        }} onMouseEnter={(e) => {
                            e.target.style.backgroundColor = item.path === "/logout" ? "#ddd" : "#333";
                        }} onMouseLeave={(e) => {
                            e.target.style.backgroundColor = item.path === "/logout" ? "#fff" : "transparent";
                        }}>
                            <span style={{ fontSize: "18px" }}>{item.icon}</span>
                            {!collapsed && <span>{item.title}</span>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
