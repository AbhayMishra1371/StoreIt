"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Users } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const uplodeFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketfile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    const fileDocument = {
      type: getFileType(file.name).type,
      name: bucketfile.name,
      url: constructFileUrl(bucketfile.$id),
      extension: getFileType(bucketfile.name).extension,
      size: bucketfile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketfileId: bucketfile.$id,
    };
    const newfile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.fileCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketfile.$id);
        handleError(error, "Failed to create file document");
      });

      revalidatePath(path);

      return parseStringify(newfile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};
