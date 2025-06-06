import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { FileUploder } from "./FileUploder";
import { Search } from "./Search";
import { signOutUser } from "@/lib/actions/user.actions";


export const Header = ({userId,accountId}:{userId:string;accountId:string}) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploder ownerId={userId} accountId={accountId} />
        <form action ={async ()=> {
          "use server";
          await signOutUser();
          }}>
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};
