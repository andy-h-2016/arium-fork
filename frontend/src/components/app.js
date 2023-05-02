import React, { useEffect, useState } from "react";
import axios from "axios";
import superagent from "superagent";
// import { Route} from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from "../util/route_util";
import { Switch } from "react-router-dom";
import Splash from "./splash/splash";
// import ProfileContainer from './profile/profile_container';
import TerrariumContainer from "./terrarium/terrarium_container";
import WaterTrackerContainer from "./water_tracker/water_tracker_container";
import Modal from "./modal/modal";
import SideBar from "./sidebar/sidebar_container";
import TerrariumIndexContainer from "./terrarium/terrarium_index_container";
import InfoPage from "./info/info_page";
import DonationInfoPage from "./info/donation_info";
import TerrariumShowContainer from "./terrarium/terrarium_show_container";
import InstructionPage from "./info/instruction";

const App = () => {
  const [oldGit, setOldGit] = useState(null);
  const [newGit, setNewGit] = useState(null);

  useEffect(() => {
    axios.get("/version").then((res) => {
      const prevGitHash = window.localStorage.getItem("gitHash") || "";
      const gitHash = res.data.gitHash;
      window.localStorage.setItem("gitHash", gitHash);
      setOldGit(prevGitHash);
      setNewGit(gitHash);
    });

    const gitInterval = setInterval(() => {
      const prevGitHash = window.localStorage.getItem("gitHash") || "";
      axios.get("/version").then((res) => {
        const gitHash = res.data.gitHash;
        window.localStorage.setItem("gitHash", gitHash);
        setOldGit(prevGitHash);
        setNewGit(gitHash);
      });
    }, 60 * 1000);

    return () => clearInterval(gitInterval);
  }, []);

  return (
    <div className="main-container">
      <div>
        <div>Old hash: {oldGit}</div>
        <div>New hash: {newGit}</div>
      </div>
      <SideBar />
      <Modal />
      {/* <ProtectedRoute path="/" component={TimerContainer}/> */}
      <Switch>
        <AuthRoute exact path="/" component={Splash} />

        <ProtectedRoute
          exact
          path="/terrarium"
          component={TerrariumContainer}
        />
        <ProtectedRoute
          exact
          path="/terrarium/:id"
          component={TerrariumShowContainer}
        />
        <ProtectedRoute
          exact
          path="/terrariums"
          component={TerrariumIndexContainer}
        />
        <ProtectedRoute
          exact
          path="/watertracker"
          component={WaterTrackerContainer}
        />
        <ProtectedRoute exact path="/info" component={InfoPage} />
        <ProtectedRoute exact path="/donation" component={DonationInfoPage} />
        <ProtectedRoute exact path="/instruction" component={InstructionPage} />
      </Switch>
      <div className="foot">
        <div className="push"></div>
        <footer className="foot"></footer>
      </div>
    </div>
  );
};

export default App;
