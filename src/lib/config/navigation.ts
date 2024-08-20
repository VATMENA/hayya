export type NavItem = {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
};

export type SidebarNavItem = NavItem & {
  items: SidebarNavItem[];
  collapsible?: boolean;
};

export type NavItemWithChildren = NavItem & {
  items: NavItemWithChildren[];
};

export type Navigation = {
  main: NavItem[];
  sidebar: SidebarNavItem[];
};

export const navigation: Navigation = {
  // By default, `main` navigation items are rendered in the top navigation bar.
  main: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "HQ",
      href: "/",
    },
    {
      title: "Releases",
      href: "https://github.com/VATMENA/hayya/releases",
      external: true,
    },
  ],
  // By default, `sidebar` navigation only supports 2 levels of navigation.
  sidebar: [
    {
      title: "Overview",
      collapsible: true,
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
      ],
    },
    {
      title: "Training",
      collapsible: true,
      items: [
        {
          title: "Overview",
          href: "/docs/training/overview",
          items: [],
        },
        {
          title: "Get Training",
          href: "/docs/training/get-training",
          items: [],
        },
        {
          title: "Training Plans",
          href: "/docs/training/training-plans",
          items: [],
        },
        {
          title: "Training Requests",
          href: "/docs/training/training-requests",
          items: [],
        },
      ],
    },
    {
      title: "Misc",
      collapsible: true,
      items: [
        {
          title: "Markdown Guide",
          href: "/docs/misc/markdown-guide",
          items: [],
        },
      ],
    },
  ],
};
