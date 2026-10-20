"use client";

import React, { useState } from "react";
import { AuthUser } from "@/context/AuthContext";

interface UserAvatarProps {
  user: AuthUser;
  className?: string;
}

export default function UserAvatar({ user, className = "" }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  if (user.avatar && !imageError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatar}
        alt={user.name}
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`w-full h-full rounded-full bg-gradient-to-tr from-amber-200 to-amber-100 text-amber-900 font-extrabold flex items-center justify-center select-none shadow-2xs ${className}`}
    >
      <span>{initial}</span>
    </div>
  );
}
