'use server';

import {Account, Storage,Avatars, Client,Databases } from "node-appwrite"
import { appwriteConfig } from "./config"
import { cookies } from "next/headers";

//node-appwrite

//this is client for users session
export const createSessionClient = async ()=>{
    const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

    const session = (await cookies()).get('appwrite-session');

    if(!session || !session.value) throw new Error('No Session')

    client.setSession(session.value);

    return{
        get account(){
          return new Account(client);  
        },
        get databases(){
            return new Databases(client);
        }
    }
}

//This is the Admin client for additional asses
export const createAdminClient = async ()=>{
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  

    return{
        get account(){
          return new Account(client);  
        },
        get databases(){
            return new Databases(client);
        },
        get storage(){  
            return new Storage(client);
        },
        get avatars(){  
            return new Avatars(client);
        },
    }
}