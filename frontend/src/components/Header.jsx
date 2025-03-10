export default function Header(){
    return(
        <header className="flex items-center justify-between p-3 bg-white shadow-sm">
            <span className="ml-2 text-2xl font-semibold text-sky-700">Lexify</span>
            <button className="w-10 h-10 rounded-full text-sky-700 hover:bg-sky-100">
                <i className="fa-solid fa-bars"></i>
            </button>
        </header>
    );
}