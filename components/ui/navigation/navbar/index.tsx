import Image from "next/image";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";

const Navbar = () => {
  const session = await auth();

  return (
    <div
      className="flex justify-between items-center background-light900_dark200 fixed
    z-50 w-full p-6 dark:shadow-none sm:px-12"
    >
      <Link href={"/"} className="flex items-center gap-1">
        <Image
          src={"/images/site-logo.svg"}
          width={23}
          height={23}
          alt="DevFlow logo"
        />

        <p className="h2-bold font-space-grotesk text-dark-100 
        dark:text-light-900 max-sm:hidden">
            Dev<span className="text-primary-500">Flow</span>
        </p>
      </Link>
      
        <p>Global Search</p>

        <div className="flex-between gap-5">
          <Theme />
            {session?.user?.id && (
              <UserAvatar 
              id={session.user.id}
              name={session.user.name!}
              imageUrl={session.user?.image}
              />
            )

            }
          <MobileNav />
        </div>
    </div>
  );
};

export default Navbar;
