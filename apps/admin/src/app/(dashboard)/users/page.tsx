import { auth, clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getData = async (): Promise<User[]> => {
  const { userId, getToken } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const token = await getToken();

  // Check if a dedicated user microservice URL is configured
  const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL;

  try {
    if (userServiceUrl) {
      const baseUrl = userServiceUrl.endsWith("/") ? userServiceUrl.slice(0, -1) : userServiceUrl;
      const res = await fetch(`${baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    }
  } catch (error) {
    console.warn("User service fetch failed, falling back to direct Clerk API:", error);
  }

  // Direct Clerk integration fallback
  const client = await clerkClient();
  const { data: clerkUsers } = await client.users.getUserList({
    limit: 100,
    orderBy: "-created_at",
  });

  return JSON.parse(JSON.stringify(clerkUsers)) as User[];
};

const UsersPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UsersPage;
