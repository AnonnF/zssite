import { Hero } from "@/components/home/Hero";
import { EntryCards } from "@/components/home/EntryCards";
import { AboutPreview } from "@/components/home/AboutPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EntryCards />
      <AboutPreview />
    </>
  );
}
