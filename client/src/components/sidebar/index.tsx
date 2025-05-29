import { useGetIdentity, useMenu } from "@refinedev/core";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { useNavigate } from "react-router";

export const AppSidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const { menuItems } = useMenu();
  const navigate = useNavigate();

  // You can use this to display user information in the sidebar
  const { data: user } = useGetIdentity<{ name: string; avatar: string }>();

  // Get appropriate icon based on menu item
  const getIconForItem = (itemName: string): string => {
    const normalizedName = itemName.toLowerCase();

    if (normalizedName.includes("blog") || normalizedName.includes("post")) {
      return "pi pi-file-edit";
    } else if (normalizedName.includes("categor")) {
      return "pi pi-tags";
    } else if (normalizedName.includes("user")) {
      return "pi pi-users";
    } else if (normalizedName.includes("product")) {
      return "pi pi-shopping-cart";
    } else if (normalizedName.includes("dashboard")) {
      return "pi pi-chart-bar";
    } else if (normalizedName.includes("setting")) {
      return "pi pi-cog";
    } else if (normalizedName.includes("order")) {
      return "pi pi-shopping-bag";
    }

    return "pi pi-file";
  };

  // Handle menu item click
  const handleMenuItemClick = (route?: string) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className={`sidebar-container ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        {expanded ? (
          <h2 className="app-title">Payroll</h2>
        ) : (
          <Avatar label="P" shape="circle" />
        )}
        <Button
          icon={expanded ? "pi pi-angle-left" : "pi pi-angle-right"}
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle Expand"
          text
        />
      </div>

      {user && (
        <div className="user-info">
          <Tooltip target=".user-avatar" content={user.name} position="right" disabled={expanded} />
          {user.avatar ? (
            <Avatar image={user.avatar} shape="circle" className="user-avatar" />
          ) : (
            <Avatar label={user.name?.charAt(0) || "U"} shape="circle" className="user-avatar" />
          )}
          {expanded && <span className="user-name">{user.name}</span>}
        </div>
      )}

      <div className="sidebar-menu-container">
        <ul className="sidebar-menu-list">
          {menuItems.map((item, index) => {
            const iconClass = item.icon || getIconForItem(item.name || item.label);
            return (
              <li key={index} className="sidebar-menu-item">
                <button
                  className={`sidebar-menu-button ${item.active ? 'active' : ''}`}
                  onClick={() => handleMenuItemClick(item.route)}
                >
                  <i className={iconClass}></i>
                  {expanded && <span className="menu-item-label">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
