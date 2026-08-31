import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ScrollStateProvider } from "./components/ScrollState";

export const metadata: Metadata = {
  title: "정준영 (Joonyoung Jeong) — Portfolio",
  description:
    "취약점 분석가 정준영(Joonyoung Jeong)의 포트폴리오 — 프로젝트 · 경력 · 자격 · 교육.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700;900&display=swap"
        />
      </head>
      <body>
        <ScrollStateProvider>{children}</ScrollStateProvider>
      </body>
    </html>
  );
}
