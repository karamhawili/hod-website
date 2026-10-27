import { monogramIcon } from "@/lib/brandArt";

// iOS home-screen icon. iOS rounds the corners itself, so the mark gets more
// breathing room than the favicon.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return monogramIcon(size.width, 0.6);
}
