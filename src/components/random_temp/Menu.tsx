import Link from "next/link";

import { menuItems } from "./menuIcons";

const Menu = ({ open }: { open: boolean }) => {
  return (
    <div className={`${open ? "max-w-[200px] z-20" : ""} mt-1 text-sm`}>
      {menuItems.map((section) => (
        <div className={open ? "flex flex-col gap-2" : "flex flex-col gap-1"} key={section.title}>
          {/* Seção Título */}
          <span
            className={`${
              open ? "block" : "hidden"
            } text-gray-400 dark:text-gray-100 font-light my-4`}
          >
            {section.title}
          </span>

          {/* Linha Separadora para OUTROS */}
          {section.title === "OUTROS" && (
            <hr className="border-gray-400 mt-2 border-b-[1.5px] rounded" />
          )}

          {/* Ícones e Links */}
          {section.items.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                href={item.href}
                title={item.label}
                className={`flex max-w-[200px] items-center ${
                  open ? "justify-start gap-4 py-2" : "justify-center gap-4 py-1.5"
                } text-gray-500 dark:text-gray-200 md:px-2 rounded-md hover:bg-lamaSkyLight dark:hover:bg-[#15273b] menu-item-wrapper`}
              >
                {item.icon}
                {open && <span>{item.label}</span>}
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
