"use client";
import Image from "next/image";
import React, { use, useEffect } from "react";
import { Input } from "./ui/input";
import { useSearchParams } from "next/navigation";
import { get } from "http";
import { getFiles } from "@/lib/actions/file.action";

export const Search = () => {

    const [query, setQuery] = React.useState("");
    const searchParams = useSearchParams();
    const [results, setResults] = React.useState<Models.Document>([]);

    useEffect(()=>{
        const fetchFiles = async ()=>{
            const files = await getFiles({ searchText:query})
        }
    },[])
    useEffect(() => {
        if(!searchQuery) {
            setQuery("");
        }
    } , [searchQuery]);
  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image src='/assets/icons/search.svg' alt='search' width={24} height={24} />
        <Input onChange={(e) => setQuery(e.target.value)} value={query} placeholder="Search..." className="search-input" />
      </div>
    </div>
  );
};
