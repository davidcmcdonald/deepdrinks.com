import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export function YouTubeIcon(props: Props) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M23.498 6.186a2.997 2.997 0 0 0-2.114-2.12C19.537 3.5 12 3.5 12 3.5s-7.537 0-9.384.566A2.997 2.997 0 0 0 .502 6.186 31.94 31.94 0 0 0 0 12a31.94 31.94 0 0 0 .502 5.814 2.997 2.997 0 0 0 2.114 2.12C4.463 20.5 12 20.5 12 20.5s7.537 0 9.384-.566a2.997 2.997 0 0 0 2.114-2.12A31.94 31.94 0 0 0 24 12a31.94 31.94 0 0 0-.502-5.814ZM9.75 15.02v-6.04L15.5 12l-5.75 3.02Z"/>
  </svg>;
}

export function PatreonIcon(props: Props) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M22.957 7.21c-.004-3.064-2.391-5.576-5.191-6.482-3.478-1.125-8.064-.962-11.384.604C2.357 3.231 1.093 7.391 1.046 11.54c-.039 3.411.302 12.396 5.369 12.46 3.765.047 4.326-4.804 6.068-7.141 1.24-1.662 2.836-2.132 4.801-2.618 3.376-.836 5.678-3.501 5.673-7.031Z" />
  </svg>;
}
