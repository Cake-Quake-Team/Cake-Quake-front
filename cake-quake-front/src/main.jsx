import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router";
import mainRouter from "./router/mainRouter.jsx";

createRoot(document.getElementById('root')).render(
    <RouterProvider router={mainRouter} />
)
