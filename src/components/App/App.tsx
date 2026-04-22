import { useState } from "react";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";
import Pagination from "../Pagination/Pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import { useDebouncedCallback } from "use-debounce";
import { Modal } from "../Modal/Modal";
import { NoteForm } from "../NoteForm/NoteForm";

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
    placeholderData: keepPreviousData,
  });
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const onClose = () => setIsModalOpen(false);
  const onOpen = () => setIsModalOpen(true);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox onChange={debouncedSearch} />}
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            page={page}
            setPage={setPage}
          />
        )}
        {
          <button className={css.button} onClick={onOpen}>
            Create note +
          </button>
        }
      </header>
      <main>
        {isLoading && !data && <p className={css.info}>Loading notes...</p>}
        {isError && (
          <p className={css.error}>
            Error: {error?.message || "Something went wrong"}
          </p>
        )}
        {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
        {data && data.notes.length === 0 && !isLoading && (
          <p className={css.info}>No notes found matching your search.</p>
        )}
        {isModalOpen && (
          <Modal onClose={onClose}>
            <NoteForm onCancel={onClose} />
          </Modal>
        )}
      </main>
    </div>
  );
}
