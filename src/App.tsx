import { AmcatUser, LoginForm } from "amcat4react";
import { refreshToken } from "amcat4react/dist/Amcat";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Modal } from "semantic-ui-react";
import "./App.css";
import Dashboards from "./Components/dashboards/Dashboards";

const HOST = "https://bzk2.nieuwsmonitor.org/api";
//const HOST = "http://localhost:5000";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "nlpo-dashboard-nlpo",
  ]);
  const [user, setUser] = useState<AmcatUser>();

  useEffect(() => {
    const u: AmcatUser = cookies["nlpo-dashboard-nlpo"];
    if (u == null || u.host !== HOST) return;
    refreshToken(u)
      .then((result) => {
        setUser({ ...u, token: result.data.access_token });
      })
      .catch((error) => {
        console.error(error);
        removeCookie("nlpo-dashboard-nlpo");
      });
  }, [setUser, cookies, setCookie, removeCookie]);

  const handleLogin = (u: AmcatUser) => {
    setCookie("nlpo-dashboard-nlpo", JSON.stringify(u));
    setUser(u);
  };

  console.log(user);
  return (
    <div className="App">
      {user == null ? null : <Dashboards index={{ ...user, index: "bzk" }} />}
      <Modal open={!user}>
        <Modal.Content>
          <LoginForm fix_host={HOST} onLogin={handleLogin} />
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default App;
