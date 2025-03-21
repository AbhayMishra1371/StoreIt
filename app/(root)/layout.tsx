import { Header } from "@/components/header";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Sidebar } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";


const Layout = async ({ children }:{children:React.ReactNode}) => {

   const curretUser = await getCurrentUser();
  if (!curretUser) return redirect("/sign-in");
  
  return (
    <main className="flex h-screen">
        <Sidebar {...curretUser} />
      <section className="flex h-full flex-1 flex-col">
       <MobileNavigation {...curretUser}/> 
       <Header/>
        <div className="main-content">{children}</div>
        
      </section>
    </main>
  );
}

export default Layout;