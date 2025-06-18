import { Outlet } from 'react-router';

export default function CartLayout() {
    return (
        <div className="max-w-3xl mx-auto p-4">
            <header className="mb-6">
                <h1 className="text-2xl font-bold"></h1>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}