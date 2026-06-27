import CardList from "@/components/CardList";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, Candy, Citrus, Shield } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import EditUser from "@/components/EditUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppLineChart from "@/components/AppLineChart";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const getUserData = async (id: string): Promise<User> => {
  const { userId, getToken } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const token = await getToken();

  const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL;

  try {
    if (userServiceUrl) {
      const baseUrl = userServiceUrl.endsWith("/") ? userServiceUrl.slice(0, -1) : userServiceUrl;
      const res = await fetch(`${baseUrl}/users/${id}`, {
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
    console.warn(`User service fetch failed for ID ${id}, falling back:`, error);
  }

  const client = await clerkClient();
  const user = await client.users.getUser(id);
  return JSON.parse(JSON.stringify(user)) as User;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const SingleUserPage = async ({ params }: PageProps) => {
  const { id } = await params;

  let user: User;
  try {
    user = await getUserData(id);
  } catch (error) {
    console.error(`Failed to load user details for ID: ${id}`, error);
    return notFound();
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "No Name";
  const email = user.emailAddresses[0]?.emailAddress || "No Email";
  const phone = user.phoneNumbers[0]?.phoneNumber || "Not specified";
  const rawImageUrl = user.imageUrl || (user as any).image_url;
  const avatarUrl = rawImageUrl && rawImageUrl.trim() !== "" ? rawImageUrl : "/placeholder.png";
  const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "U";

  // Metadata fallback check
  const role = (user.publicMetadata?.role as string) || "user";
  const address = (user.publicMetadata?.address as string) || "Not specified";
  const city = (user.publicMetadata?.city as string) || "Not specified";

  // Compute profile completion score (max 100)
  let completionScore = 0;
  if (rawImageUrl && rawImageUrl.trim() !== "") completionScore += 20;
  if (user.firstName || user.lastName) completionScore += 20;
  if (user.emailAddresses.length > 0) completionScore += 20;
  if (user.phoneNumbers.length > 0) completionScore += 20;
  if (user.username) completionScore += 20;

  const joinedOn = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/users">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{fullName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* CONTAINER */}
      <div className="mt-4 flex flex-col xl:flex-row gap-8">
        {/* LEFT */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* USER BADGES CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">User Badges</h1>
            <div className="flex gap-4 mt-4">
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeCheck
                    size={36}
                    className="rounded-full bg-blue-500/30 border-1 border-blue-500/50 p-2"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Verified User</h1>
                  <p className="text-sm text-muted-foreground">
                    This user has been verified by the admin.
                  </p>
                </HoverCardContent>
              </HoverCard>
              {role === "admin" && (
                <HoverCard>
                  <HoverCardTrigger>
                    <Shield
                      size={36}
                      className="rounded-full bg-green-800/30 border-1 border-green-800/50 p-2"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Admin</h1>
                    <p className="text-sm text-muted-foreground">
                      Admin users have access to all features and can manage
                      users.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              )}
              <HoverCard>
                <HoverCardTrigger>
                  <Candy
                    size={36}
                    className="rounded-full bg-yellow-500/30 border-1 border-yellow-500/50 p-2"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Awarded</h1>
                  <p className="text-sm text-muted-foreground">
                    This user has been awarded for their contributions.
                  </p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Citrus
                    size={36}
                    className="rounded-full bg-orange-500/30 border-1 border-orange-500/50 p-2"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Popular</h1>
                  <p className="text-sm text-muted-foreground">
                    This user has been popular in the community.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          {/* USER CARD CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="size-12">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-semibold">{fullName}</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              User details and configurations within the Rajasthalii platform.
            </p>
          </div>
          {/* INFORMATION CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">User Information</h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>Edit User</Button>
                </SheetTrigger>
                <EditUser />
              </Sheet>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex flex-col gap-2 mb-8">
                <p className="text-sm text-muted-foreground">
                  Profile completion
                </p>
                <Progress value={completionScore} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Full name:</span>
                <span>{fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Email:</span>
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Phone:</span>
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Address:</span>
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">City:</span>
                <span>{city}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Joined on {joinedOn}
            </p>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-2/3 space-y-6">
          {/* CHART CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">User Activity</h1>
            <AppLineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;
