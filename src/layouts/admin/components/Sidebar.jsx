import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "../../data";
import logoLight from "../../../assets/logo-light.png";
import logoDark from "../../../assets/logo-dark.png";
import { cn } from "../../../helpers";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/index";
import Cookies from "js-cookie"; // Pastikan Anda mengimpor Cookies

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Mengirimkan permintaan logout ke server
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include", // Pastikan cookie dikirim bersama request
        }
      );

      if (response.ok) {
        // Redirect ke halaman login setelah logout
        window.location.href = "/login";
      } else {
        console.error("Logout gagal");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat logout", error);
    }
  };

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      <div className="flex gap-x-3 p-3 items-center">
        <img src={logoLight} alt="Logoipsum" className="w-40 dark:hidden" />
        <img src={logoDark} alt="Logoipsum" className="w-40 hidden dark:block" />
      </div>
      <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
        {navbarLinks.map((navbarLink) => (
          <nav
            key={navbarLink.title}
            className={cn("sidebar-group", collapsed && "md:items-center")}
          >
            <p
              className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}
            >
              {navbarLink.title}
            </p>
            {navbarLink.links.map((link) =>
              link.path === "logout" ? (
                <button
                  key={link.label}
                  onClick={handleLogout}
                  className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                >
                  <link.icon size={22} className="flex-shrink-0" />
                  {!collapsed && (
                    <p className="whitespace-nowrap">{link.label}</p>
                  )}
                </button>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.path}
                  className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                >
                  <link.icon size={22} className="flex-shrink-0" />
                  {!collapsed && (
                    <p className="whitespace-nowrap">{link.label}</p>
                  )}
                </NavLink>
              )
            )}
          </nav>
        ))}
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};
