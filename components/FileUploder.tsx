"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}
export const FileUploder = ({ ownerId, accountId, className }: Props) => {
    const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="uplode"
          width={24}
          height={24}
        />{" "}
        <p>Uplode</p>
      </Button>
      {files.length >0 && <ul className="uploder-preview-list">
        <h4 className="h4 text-light-100">Uploding</h4>
 
        {files.map((file,index) => {
             const {type,extension} = getFileType(file.name);

             return (
              <li 
              key={`${file.name}-${index}`}
              className="uploader-preview-item">
               <div className="flex items-center gap-3">
                <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)}/>
               </div>
              </li>
             );
        })} 
        </ul>}
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};
