import { Header } from "@/components/header";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Sidebar } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import { Toaster } from "@/components/ui/toaster"


const Layout = async ({ children }:{children:React.ReactNode}) => {

   const curretUser = await getCurrentUser();
  if (!curretUser) return redirect("/sign-in");
  
  return (
    <main className="flex h-screen">
        <Sidebar {...curretUser} />
      <section className="flex h-full flex-1 flex-col">
       <MobileNavigation {...curretUser}/> 
       <Header userId ={curretUser.$id} accountId = {curretUser.accountId}/>
        <div className="main-content">{children}</div>
        
      </section>
      <Toaster />
    </main>
  );
}

export default Layout;