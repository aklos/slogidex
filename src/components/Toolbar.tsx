import React, { useContext } from "react";
import {
  House,
  HouseFill,
  MoonStars,
  MoonStarsFill,
} from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import Context from "../context";
import Button from "./lib/Button";

export default function Toolbar() {
  const context = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="w-full h-8 border-b dark:border-black flex items-center">
      <div className="w-80 flex-shrink-0">
        <Button
          Icon={location.pathname === "/" ? HouseFill : House}
          label="Home"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="w-full"></div>
      <div className="w-80 flex-shrink-0 flex justify-end">
        <Button
          Icon={context.darkMode ? MoonStarsFill : MoonStars}
          onClick={() => context.toggleDarkMode()}
        />
      </div>
    </nav>
  );
}
