export type MenuType = {
  LanguageIsoCode?: string;
  Count?: number;
  MenuType?: MenuTypeElement[];
  TabBarDatas?: TabBarData[];
};

type MenuTypeElement = {
  Code?: number;
  Label?: string;
};

type TabBarData = {
  IdMenuTabBar?: number;
  IdMenuTabBarType?: number;
  MenuTabBarName?: string;
  MenuTabBarValue?: string;
  MenuTabBarURL?: string;
  MenuTabBarActive?: number;
  CanHover?: boolean;
  MenuColumns?: MenuColumn[];
};

type MenuGroupElement = {
  IdMenuGroupElement?: number;
  IdMenuGroupElementType?: number;
  MenuGroupElementName?: string;
  MenuGroupElementActive?: number;
  MenuElements?: MenuElement[];
};

export type MenuElement = {
  IdMenuElement?: number;
  IdMenuElementType?: number;
  MenuElementName?: string;
  MenuElementValue?: string;
  MenuElementURL?: string;
  MenuElementPosition?: number;
  MenuElementState?: number;
  Media?: MenuMedia;
};

type Images = {
  menu_large?: MenuImage;
  menu_medium?: MenuImage;
  menu_small?: MenuImage;
};

export interface MenuImage {
  Src?: string;
  Width?: number;
  Height?: number;
  Active?: number;
}

export interface MenuMedia {
  Images: {
    menu_medium: MenuImage;
  };
}

export interface MenuItem {
  MenuColumnName: string;
  MenuGroupElements: MenuGroupElement[];
}

export interface SubMenuProps {
  idMenuColumn?: number;
  items: MenuItem[];
}


export interface MenuItem {
  MenuColumnName: string;
  MenuGroupElements: MenuGroupElement[];
}

export interface MenuTabBar {
  IdMenuTabBar: number;
  MenuTabBarName: string;
  MenuTabBarURL: string;
  MenuColumns: MenuItem[];
}
export type MenuColumn = {
  IdMenuColumn?: number;
  MenuColumnName?: string;
  MenuColumnActive?: number;
  MenuGroupElements?: MenuGroupElement[];
};
export interface MenuData {
  TabBarDatas: MenuTabBar[];
  // Add other menu data properties as needed
}
