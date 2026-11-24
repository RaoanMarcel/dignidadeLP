import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integration/supabase/auth-middleware";
import { supabaseAdmin } from "@/integration/supabase/client.server";
import type { Database } from "@/integration/supabase/types";

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("id, title, excerpt, content, image_url, category, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listAllPostsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const postInput = z.object({
  title: z.string().trim().min(3).max(160),
  excerpt: z.string().trim().max(280).optional().nullable(),
  content: z.string().trim().min(10).max(20000),
  image_url: z.string().trim().url().max(500).optional().nullable().or(z.literal("")),
  category: z.enum(["atualizacao", "evento", "doacao", "historia"]),
  published: z.boolean().optional(),
});

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => postInput.parse(raw))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("posts")
      .insert({
        title: data.title,
        excerpt: data.excerpt || null,
        content: data.content,
        image_url: data.image_url || null,
        category: data.category,
        published: data.published ?? true,
        author_id: context.userId,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updatePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => postInput.extend({ id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { id, ...rest } = data;
    const { error } = await context.supabase
      .from("posts")
      .update({
        title: rest.title,
        excerpt: rest.excerpt || null,
        content: rest.content,
        image_url: rest.image_url || null,
        category: rest.category,
        published: rest.published ?? true,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { isAdmin: !!data };
  });