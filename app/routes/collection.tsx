import { z } from "zod";
import { Send } from "lucide-react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";

import supabase from "@/lib/supabase";

const getCollection = async (id: string) => {
  const collection = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (collection.error) {
    console.error(collection.error);
    return;
  }

  return collection.data;
};

const getMessages = async (collectionId: string) => {
  const messages = await supabase
    .from("messages")
    .select("*")
    .eq("collection_id", collectionId);

  if (messages.error) {
    console.error(messages.error);
    return;
  }

  return messages.data;
};

const createMessage = async ({
  id,
  data,
}: {
  id: string;
  data: z.infer<typeof formScheme>;
}) => {
  const { error } = await supabase.from("messages").insert([
    {
      collection_id: id,
      ...data,
    },
  ]);

  if (error) {
    console.error(error);
    return;
  }
};

const formScheme = z.object({
  message: z.string().min(1),
});

function Collection() {
  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      message: "",
    },
  });
  const params = useParams();
  const queryClient = useQueryClient();

  const collection = useQuery({
    queryKey: ["collection", params.id],
    queryFn: () => {
      if (!params.id) {
        return null;
      }

      return getCollection(params.id);
    },
  });

  const messages = useQuery({
    queryKey: ["messages", params.id],
    queryFn: () => {
      if (!params.id) {
        return null;
      }

      return getMessages(params.id);
    },
  });

  const mutation = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", params.id] });
    },
  });

  const onSubmit = async (data: z.infer<typeof formScheme>) => {
    if (!params.id) {
      return;
    }

    await mutation.mutateAsync({ id: params.id, data });
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4">
        {messages.data?.map((message) => (
          <>
            <Card className="ml-auto">
              <CardHeader>
                <CardDescription>{message.message}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="mr-auto">
              <CardHeader>
                <CardDescription>{message.response}</CardDescription>
              </CardHeader>
            </Card>
          </>
        ))}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-2 bg-secondary rounded-lg px-4 py-2"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Type your question here..."
                    className="w-full outline-none border-none ring-0 focus-visible:outline-none focus-visible:border-none focus-visible:ring-0 resize-none shadow-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <div />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="rounded-full"
            >
              <Send />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Collection;
