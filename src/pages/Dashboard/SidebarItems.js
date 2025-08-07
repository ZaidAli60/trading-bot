import { Link } from "react-router-dom"

const root = "/dashboard"

export const items = [
    { key: "dashboard", icon: <i className='fa-solid fa-gauge-high'></i>, label: <Link to={root}>Dashboard</Link>, },
    { key: "trades", icon: <i className="fa-solid fa-arrow-trend-up"></i>, label: <Link to={root}>Trades</Link>, },
    { key: "trade-history", icon: <i className="fa-solid fa-arrow-trend-up"></i>, label: <Link to={root}>Trade History</Link>, },
    // {
    //     key: "products", icon: <i className="fa-solid fa-cart-plus"></i>, label: "Products",
    //     children: [
    //         { key: "products-0", icon: <i className='fa-regular fa-square-plus'></i>, label: <Link to={root + "/products/add"}>Add Product</Link> },
    //         { key: "products-1", icon: <i className="fa-solid fa-chalkboard-user"></i>, label: <Link to={root + "/products/all"}>All Products</Link> },
    //     ]
    // },
    // {
    //     key: "orders", icon: <i className="fa-solid fa-cart-plus"></i>, label: "Orders",
    //     children: [
    //         { key: "orders-0", icon: <i className='fa-regular fa-square-plus'></i>, label: <Link to={root + "/orders/all"}>Orders</Link> },
    //     ]
    // },
    // {
    //     key: "settings", icon: <i className="fa-solid fa-cogs"></i>, label: "Settings",
    //     children: [
    //         { key: "settings-0", icon: <i className='fa-solid fa-shield-halved'></i>, label: <Link to={root + "/settings/account"}>Account</Link> },
    //         { key: "settings-1", icon: <i className="fa-regular fa-id-badge"></i>, label: <Link to={root + "/settings/profile"}>Profile</Link> },
    //     ]
    // },
    // { key: "messages", icon: <i className="fa-solid fa-message"></i>, label: <Link to={root + "/messages/all"}>Messages</Link>, allowedroles: ["superAdmin"] },
    // { key: "admin", icon: <i className="fa-solid fa-user"></i>, label: <Link to={root + "/admin/all"}>Users</Link>, allowedroles: ["superAdmin"] },
]