import React from "react";
//core components
import { NavLink } from "react-router-dom";
//import PropTypes from "prop-types";

//data
import { ItemSidebarLeft } from "./ItemSidebarLeft";

const SidebarLeft = () => {
  let activeStyle = {
    textDecoration: "none",
  };

  return (
    <>
      <div className="h-screen fixed overflow-scroll -mt-2 z-30">
        <ul className="menu w-[150vw] lg:w-64 p-3 bg-base-100 box h-screen">
          {ItemSidebarLeft.map((item, index) => {
            return (
              <>
                <li key={index} className="menu-title text-base-500 font-bold py-2">
                  {item.menuTitle}
                </li>
                {item.menuItems.map((it, idx) => {
                  return (
                    <li key={idx}>
                      <NavLink key={idx} to={it.path} style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                        {it.icon}
                        {it.title}
                      </NavLink>
                    </li>
                  );
                })}
              </>
            );
          })}
        </ul>
      </div>
    </>
  );
};
/*
SidebarLeft.propTypes = {
  isOpen: PropTypes.bool,
  isContext: PropTypes.bool,
};
*/
export default SidebarLeft;
