import { useAuth } from "../../context/authProvider";

interface HomeProps {}

function Home() {
  const { accessToken } = useAuth();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  return (
    <div>
      Home
      {accessToken ? <p>Authenticated</p> : <p>Not Authenticated</p>}
      <button onClick={handleLogout}>log out</button>
    </div>
  );
}

export default Home;
