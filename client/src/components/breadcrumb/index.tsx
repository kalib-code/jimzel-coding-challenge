import { useBreadcrumb } from "@refinedev/core";
import { BreadCrumb } from "primereact/breadcrumb";
import { MenuItem } from "primereact/menuitem";
import { useNavigate } from "react-router";

export const Breadcrumb = () => {
  const { breadcrumbs } = useBreadcrumb();
  const navigate = useNavigate();

  // Convert Refine breadcrumbs to PrimeReact MenuItem format
  const items: MenuItem[] = breadcrumbs.map((breadcrumb) => ({
    label: breadcrumb.label,
    command: () => {
      if (breadcrumb.href) {
        navigate(breadcrumb.href);
      }
    },
    disabled: !breadcrumb.href,
  }));

  // The last item is the current page and should be displayed as the active item
  const home: MenuItem = {
    icon: 'pi pi-home',
    command: () => navigate('/'),
  };

  console.log(items)

  return (
    <div className="custom-breadcrumb">
      <BreadCrumb
        model={items}
        home={home}
        className="surface-ground border-none pl-0"
      />
    </div>
  );
};
