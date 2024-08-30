"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import showErrorToast from "@/components/Toast/ErrorToast";
import { subredditSchema } from "@/lib/validation-schemas";
import { createSubreddit } from "@/lib/actions";

interface CreateSubredditFormProps {
  onCloseModal: () => void;
}

async function checkUniqueName(name: string): Promise<boolean> {
  // const response = await fetch(`/api/check-unique-name?name=${name}`);
  // const data = await response.json();
  return true;
}

function CreateSubredditForm({ onCloseModal }: CreateSubredditFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof subredditSchema>>({
    resolver: zodResolver(subredditSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: undefined,
      banner: undefined,
      is_private: false,
    },
  });

  const name = useWatch({ control: form.control, name: "name" });

  const onSubmit = async (values: z.infer<typeof subredditSchema>) => {
    try {
      const iconUpload = new FormData();
      if (values.icon) {
        iconUpload.append("file", values.icon);
      }

      const backgroundUpload = new FormData();
      if (values.banner) {
        backgroundUpload.append("file", values.banner);
      }

      const iconResponse = values.icon
        ? await axios.post("/api/upload", iconUpload)
        : { data: { url: "" } };
      const backgroundResponse = values.banner
        ? await axios.post("/api/upload", backgroundUpload)
        : { data: { url: "" } };

      const subredditData = {
        ...values,
        icon: iconResponse.data.url,
        banner: backgroundResponse.data.url,
      };

      await createSubreddit(subredditData);
      onCloseModal?.();
      form.reset();
      console.log(subredditData);
    } catch (error) {
      showErrorToast("An error occurred while creating the subreddit");
    }
  };

  useEffect(() => {
    console.log("hello");
    const debouncedCheckUniqueName = debounce(async (name: string) => {
      if (name.length >= 3) {
        const isUnique = await checkUniqueName(name);
        if (!isUnique) {
          form.setError("name", {
            type: "manual",
            message: "Name is already taken",
          });
        } else {
          form.clearErrors("name");
        }
      }
    }, 500);
    if (name) {
      debouncedCheckUniqueName(name);
    }
  }, [name, form]);

  return (
    <div className="text-black">
      {/* <h2>Create Subreddit</h2> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Subreddit name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center">
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center">
                <FormLabel>Background</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_private"
            render={({ field }) => (
              <FormItem className="flex items-baseline space-x-4">
                <FormLabel>Private</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Create Subreddit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateSubredditForm;
