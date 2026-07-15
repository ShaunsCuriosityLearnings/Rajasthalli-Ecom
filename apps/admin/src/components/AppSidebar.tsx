import {
  Home,
  User2,
  ChevronUp,
  Plus,
  Shirt,
  User,
  ShoppingBasket,
  Layers3,
  Tags,
  UploadCloud,
  FileImage,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";

import Link from "next/link";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Sheet, SheetTrigger } from "./ui/sheet";

import AddOrder from "./AddOrder";
import AddUser from "./AddUser";
import AddCategory from "./AddCategory";
import AddProduct from "./AddProduct";
import MainCategory from "./MainCategory";
import BulkUploadProducts from "./BulkUploadProducts";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/logo.svg" alt="logo" width={20} height={20} />
                <span>Rajasthalli Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* APPLICATION */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* CATALOG */}
        <SidebarGroup>
          <SidebarGroupLabel>Catalog</SidebarGroupLabel>

          <SidebarGroupAction>
            <Plus />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {/* PRODUCTS */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/products">
                    <Shirt />
                    Products
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Sheet>
                  <SheetTrigger asChild>
                    <SidebarMenuButton>
                      <Plus />
                      Add Product
                    </SidebarMenuButton>
                  </SheetTrigger>

                  <AddProduct />
                </Sheet>
              </SidebarMenuItem>

              {/* <SidebarMenuItem>
                <Sheet>
                  <SheetTrigger asChild>
                    <SidebarMenuButton>
                      <UploadCloud />
                      Bulk Upload Products
                    </SidebarMenuButton>
                  </SheetTrigger>

                  <BulkUploadProducts />
                </Sheet>
              </SidebarMenuItem> */}

              {/* MAIN CATEGORIES */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/main-categories">
                    <Layers3 />
                    Main Categories
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Sheet>
                  <SheetTrigger asChild>
                    <SidebarMenuButton>
                      <Plus />
                      Add Main Category
                    </SidebarMenuButton>
                  </SheetTrigger>

                  <MainCategory />
                </Sheet>
              </SidebarMenuItem>

              {/* CATEGORIES */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/categories">
                    <Tags />
                    Categories
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Sheet>
                  <SheetTrigger asChild>
                    <SidebarMenuButton>
                      <Plus />
                      Add Category
                    </SidebarMenuButton>
                  </SheetTrigger>

                  <AddCategory />
                </Sheet>
              </SidebarMenuItem>

              {/* HERO BANNER */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/hero-slides">
                    <FileImage />
                    Hero Banners
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* USERS */}
        <SidebarGroup>
          <SidebarGroupLabel>Users</SidebarGroupLabel>

          <SidebarGroupAction>
            <Plus />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/users">
                    <User />
                    Users
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Sheet>
                  <SheetTrigger asChild>
                    <SidebarMenuButton>
                      <Plus />
                      Add User
                    </SidebarMenuButton>
                  </SheetTrigger>

                  <AddUser />
                </Sheet>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ORDERS */}
        <SidebarGroup>
          <SidebarGroupLabel>Orders & Payments</SidebarGroupLabel>

          <SidebarGroupAction>
            <Plus />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/orders">
                    <ShoppingBasket />
                    Transactions
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Sheet>
                  <SheetTrigger asChild>
                    <SidebarMenuButton>
                      <Plus />
                      Add Order
                    </SidebarMenuButton>
                  </SheetTrigger>

                  <AddOrder />
                </Sheet>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  John Doe
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem>Account</DropdownMenuItem>

                <DropdownMenuItem>Settings</DropdownMenuItem>

                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
