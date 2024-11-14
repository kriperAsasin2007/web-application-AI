import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authProvider";

function Header() {
  const { logout, accessToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/sign-in");
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md flex items-center">
      <h2
        onClick={() => navigate("/")}
        className="text-2xl font-bold cursor-pointer hover:text-blue-200 transition-colors"
      >
        Web Application AI
      </h2>
      <nav className="flex ml-auto gap-6">
        <span
          onClick={() => navigate("/journal")}
          className="cursor-pointer hover:text-blue-200 transition-colors text-lg font-medium"
        >
          Journal
        </span>
        {accessToken ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer hover:text-red-300 transition-colors"
            onClick={handleLogout}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
            />
          </svg>
        ) : (
          <span
            onClick={() => navigate("/sign-in")}
            className="cursor-pointer hover:text-blue-200 transition-colors text-lg font-medium"
          >
            Log in
          </span>
        )}
      </nav>
    </header>
  );
}

export default Header;
