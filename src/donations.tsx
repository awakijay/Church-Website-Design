import { createRoot } from "react-dom/client";
import DonationsApp from "./app/DonationsApp";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<DonationsApp />);
