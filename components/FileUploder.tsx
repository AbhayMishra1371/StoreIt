"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { useToast } from "@/hooks/use-toast"
import { uplodeFile } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";


interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}
export const FileUploder = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const {toast} = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);

    const uploadPromises = acceptedFiles.map(async (file) => {
      if (file.size > 50* 1024 * 1024) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

        return toast({
          description: (
            <p className="body-2 text-white">
              <span className="font-semibold">
                {file.name} 
              </span> is too large. Please select a file smaller than 10MB.
            </p>
          ),className:"error-toast",  
        });
      }

      return uplodeFile({file, ownerId, accountId, path}).then((uploadedFile)=>{
        if(uploadedFile){
          setFiles((prevFiles)=>prevFiles.filter((f)=>f.name !== file.name)
        );
        }

      })
      await Promise.all(uploadPromises);
    });
  }, [ownerId, accountId, path]);
  const { getRootProps, getInputProps} = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };
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
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploding</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>
                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
