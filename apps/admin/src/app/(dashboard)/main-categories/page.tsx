import { MainCategoryType } from "@repo/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getData = async (): Promise<MainCategoryType[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
  const url = `${baseUrl}/maincategory`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch main categories: ${res.statusText}`);
  }
  const data: MainCategoryType[] = await res.json();
  return data;
};

const MainCategoriesPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Main Categories</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default MainCategoriesPage;
