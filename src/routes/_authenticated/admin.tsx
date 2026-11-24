import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integration/supabase/client";
import { listAllPostsAdmin, createPost, updatePost, deletePost, checkIsAdmin } from "@/lib/posts.functions";
import { Heart, LogOut, Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type PostRow = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  published: boolean;
  created_at: string;
};

const CATEGORIES = [
  { v: "atualizacao", l: "Atualização" },
  { v: "evento", l: "Evento" },
  { v: "doacao", l: "Doação" },
  { v: "historia", l: "História" },
];

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchAll = useServerFn(listAllPostsAdmin);
  const fetchIsAdmin = useServerFn(checkIsAdmin);
  const create = useServerFn(createPost);
  const update = useServerFn(updatePost);
  const remove = useServerFn(deletePost);

  const admin = useQuery({ queryKey: ["is-admin"], queryFn: () => fetchIsAdmin() });
  const posts = useQuery({
    queryKey: ["posts", "admin"],
    queryFn: () => fetchAll(),
    enabled: !!admin.data?.isAdmin,
  });

  const [editing, setEditing] = useState<PostRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  const saveMut = useMutation({
    mutationFn: async (payload: Record<string, unknown> & { id?: string }) => {
      if (payload.id) return update({ data: payload as never });
      return create({ data: payload as never });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      setShowForm(false);
      setEditing(null);
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (admin.isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  if (!admin.data?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center rounded-3xl bg-card border border-border p-8 shadow-soft">
          <h1 className="font-display text-2xl text-ocean">Sem permissão</h1>
          <p className="mt-3 text-muted-foreground">
            Sua conta está autenticada, mas ainda não tem permissão de administrador. Adicione o papel <code className="text-xs">admin</code> ao seu usuário diretamente na tabela <b>user_roles</b> no painel do seu Supabase.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to="/" className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">Voltar ao site</Link>
            <button onClick={signOut} className="rounded-full gradient-ocean text-primary-foreground px-4 py-2 text-sm">Sair</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-ocean">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full gradient-ocean text-primary-foreground">
              <Heart className="h-4 w-4" fill="currentColor" />
            </span>
            Painel · Projeto Dignidade
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ocean">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-ocean">Atualizações</h1>
            <p className="text-sm text-muted-foreground">Publique eventos, doações e novidades do projeto.</p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 rounded-full gradient-ocean text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft"
          >
            <Plus className="h-4 w-4" /> Nova publicação
          </button>
        </div>

        {showForm && (
          <PostForm
            initial={editing ?? undefined}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            onSubmit={(v) => saveMut.mutate({ ...v, id: editing?.id })}
            submitting={saveMut.isPending}
            error={saveMut.error?.message ?? null}
          />
        )}

        <div className="mt-8 space-y-4">
          {posts.isLoading && <p className="text-muted-foreground">Carregando...</p>}
          {posts.data?.map((p: PostRow) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-primary font-medium">
                  {p.category}
                  {!p.published && <span className="rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">rascunho</span>}
                </div>
                <div className="mt-1 font-display text-lg text-ocean">{p.title}</div>
                {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(p); setShowForm(true); }}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm hover:bg-secondary"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
                <button
                  onClick={() => confirm("Excluir esta publicação?") && delMut.mutate(p.id)}
                  className="inline-flex items-center gap-1 rounded-full border border-destructive/40 text-destructive px-3 py-2 text-sm hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Excluir
                </button>
              </div>
            </div>
          ))}
          {posts.data?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Nenhuma publicação ainda. Crie a primeira!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function PostForm({
  initial,
  onCancel,
  onSubmit,
  submitting,
  error,
}: {
  initial?: Partial<PostRow>;
  onCancel: () => void;
  onSubmit: (v: {
    title: string; excerpt: string; content: string; image_url: string;
    category: "atualizacao" | "evento" | "doacao" | "historia"; published: boolean;
  }) => void;
  submitting: boolean;
  error: string | null;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "atualizacao");
  const [published, setPublished] = useState<boolean>(initial?.published ?? true);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title,
          excerpt: excerpt ?? "",
          content,
          image_url: imageUrl ?? "",
          category: category as "atualizacao" | "evento" | "doacao" | "historia",
          published,
        });
      }}
      className="mt-8 rounded-3xl border border-border bg-card p-6 space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Título</label>
          <input required minLength={3} maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Categoria</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm">
            {CATEGORIES.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Imagem (URL)</label>
          <input type="url" value={imageUrl ?? ""} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..."
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Resumo</label>
          <input maxLength={280} value={excerpt ?? ""} onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Conteúdo</label>
          <textarea required minLength={10} maxLength={20000} rows={8} value={content} onChange={(e) => setContent(e.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Publicado
        </label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="rounded-full border border-border px-5 py-2 text-sm">Cancelar</button>
        <button type="submit" disabled={submitting} className="rounded-full gradient-ocean text-primary-foreground px-5 py-2 text-sm font-semibold disabled:opacity-60">
          {submitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}