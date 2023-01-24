import { useContext } from "react";
import { Login } from "./screens/authentication";
import { Home } from "./screens/home";
import { UserContext } from "./utils/UserContext";

export default function AppRouter() {
  const user = useContext(UserContext);

  if (user.userId) return <Home />;
  else return <Login />;
}
