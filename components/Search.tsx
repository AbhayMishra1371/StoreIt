"use client";
import Image from "next/image";
import React, { use, useEffect } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter,useSearchParams } from "next/navigation";
import { get } from "http";
import { getFiles } from "@/lib/actions/file.action";
import { Models } from "node-appwrite";
import { set } from "zod";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";


export const Search = () => {
  const [query, setQuery] = React.useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [results, setResults] = React.useState<Models.Document[]>([]);

  const [open, setOpen] = React.useState(false);
 const router = useRouter();
 const path = usePathname();
  useEffect(() => {
    const fetchFiles = async () => {
      if(!query){
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const files = await getFiles({ searchText: query });

      setResults(files.documents);
      setOpen(true);
    };

    fetchFiles();
  }, [query]);
  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);

    router.push(`/${file.type === 'video' || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`);
  }
  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
        />
        <Input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          placeholder="Search..."
          className="search-input"
        />

        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  onClick={() => handleClickItem(file)}
                  
                  className="flex items-center justify-between"
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>

                  <FormattedDateTime date={file.$createdAt} className="caption line-clamp-1 text-light-200"/>
                </li>
              ))
            ) : (
              <p className="empty-result">No Files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
