"use client";

import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  eventName: string;
  eventData?: Record<string, string>;
};

export function TrackLink({ children, eventName, eventData, onClick, ...props }: Props) {
  return <a {...props} onClick={(event) => { track(eventName, eventData); onClick?.(event); }}>{children}</a>;
}
