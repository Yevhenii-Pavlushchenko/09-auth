import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { NoteTag } from "@/types/note";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

type Props = {
  params: Promise<{slug: string[]}>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = (slug[0] === "all" ? undefined : slug[0]) as NoteTag;
  const title = tag ? `NoteHub - ${tag}` : "NoteHub - All Notes";
  const description  = tag ? `Browse ${tag} notes on NoteHub.` : "Browse all notes on NoteHub.";

  return {
    title,
    description,
    openGraph: {
      url: tag
        ? `https://08-zustand-mauve-gamma.vercel.app/notes/filter/all${tag}`
        : "https://08-zustand-mauve-gamma.vercel.app/notes/filter/all",
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub - A modern Todo application",
        },
      ],
    }
  }
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params

  const tag = (slug[0] === "all" ? undefined : slug[0]) as
    | NoteTag
    | undefined;
  
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, ""],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: "", tag: tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag ?? 'all'} tag={ tag} />
    </HydrationBoundary>
  );
}