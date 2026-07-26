import { permanentRedirect } from "next/navigation";

// /portfolio became /archive in the Phase 7 rebuild (REDESIGN.md).
export default function Portfolio() {
  permanentRedirect("/archive");
}
