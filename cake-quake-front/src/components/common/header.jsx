import { Link } from "react-router";

function Header() {
    return (
        <header className="bg-amber-200 p-4 shadow">
            <div className="container mx-auto text-xl font-bold">
                <Link to="/">🎂 Cake Quake</Link>
            </div>
        </header>
    );
}

export default Header;
