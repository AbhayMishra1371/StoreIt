"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query, Users } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";


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

const createQueries = (currentUser: Models.Document) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ])
  ];

  return queries;
}

export const getFiles = async () => {
  const { databases } = await createAdminClient();

  try{
    const currentUser = await getCurrentUser();

    if(!currentUser) {
      throw new Error("User not found");
    }

    const queries = createQueries(currentUser);

    

    const files = await databases.listDocuments(
     appwriteConfig.databaseId,
     appwriteConfig.fileCollectionId,
     queries,
    );

    return parseStringify(files); 

  }catch (error) {
    handleError(error, "Failed to get files");
  }
}

export const renameFile = async ({fileId,name,extension,path}: RenameFileProps) => {
  const { databases } = await createAdminClient();

  try{
    const newName = `${name}${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      {
        name: newName,
      },
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  }catch (error) {
    handleError(error, "Failed to rename file");
  }

}
