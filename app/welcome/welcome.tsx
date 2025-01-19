import { z } from "zod";
import { Send } from "lucide-react";
import { redirect } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import supabase from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formScheme = z.object({
  message: z.string().min(1),
});

const createCollections = async (data: z.infer<typeof formScheme>) => {
  const collections = await supabase
    .from("collections")
    .insert([
      {
        name: data.message,
      },
    ])
    .select("id");

  if (collections.error) {
    console.error(collections.error);
    return;
  }

  return collections.data[0];
};

const createMessages = async (data: z.infer<typeof formScheme>) => {
  const collection = await createCollections(data);

  if (!collection) {
    console.log("error");
    return;
  }

  const messages = await supabase
    .from("messages")
    .insert([
      {
        collection_id: collection.id,
        message: data.message,
      },
    ])
    .select("id");

  if (messages.error) {
    console.error(messages.error);
    return;
  }

  return collection.id;
};

export function Welcome() {
  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      message: "",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createMessages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  const onSubmit = async (data: z.infer<typeof formScheme>) => {
    const collection = await mutation.mutateAsync(data);

    if (!collection) {
      console.log("error");
      return;
    }

    redirect(`/c/${collection}`);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">What can I help you with?</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-xl flex flex-col gap-2 bg-secondary rounded-lg px-4 py-2"
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
