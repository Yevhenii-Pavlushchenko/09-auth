"use client";

import css from "./Notes.client.module.css";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoResults from "@/components/NoResults/NoResults";

import { NoteTag } from "@/types/note";
import { fetchNotes } from "@/lib/api";
import Link from "next/link";

interface NotesClientProps {
  tag?: NoteTag;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");

  const { data, error, isError } = useQuery({
    queryKey: ["notes", page, searchQuery, tag],
    queryFn: () =>
      fetchNotes({ page, perPage: 12, search: searchQuery, tag: tag }),
    placeholderData: keepPreviousData,
    refetchOnMount: true,
  });
  if (isError) throw error;

  const updateSearchQuery = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setPage(1);
    },
    500,
  );

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={updateSearchQuery} />
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      {data && data.notes.length === 0 && <NoResults />}
      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}