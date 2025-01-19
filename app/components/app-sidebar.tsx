import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";

import supabase from "@/lib/supabase";

const getCollections = async () => {
  const collections = await supabase.from("collections").select("id, name");

  if (collections.error) {
    console.error(collections.error);
    return;
  }

  return collections.data;
};

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const collections = useQuery({
    queryKey: ["collections"],
    queryFn: () => getCollections(),
  });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={["1.0", "2.0", "3.0", "3.5", "4.0"]}
          defaultVersion="3.5"
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="p-4 gap-2">
        <SidebarGroup />
        {collections.data?.map((collection) => (
          <a href={`/c/${collection.id}`} key={collection.id}>
            <Card>
              <CardHeader>
                <CardTitle>{collection.name}</CardTitle>
              </CardHeader>
            </Card>
          </a>
        ))}
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <a href="/" className="flex flex-1">
          <Button className="flex-1">
            New Collection <Plus />
          </Button>
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
