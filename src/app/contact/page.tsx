import Link from "next/link";
import { profile } from "@/content/profile";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BackToHomeLink } from "@/components/layout/BackToHomeLink";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <BackToHomeLink className="mb-6" />

      <SectionLabel withAccent>CONTACT</SectionLabel>
      <h1 className="mt-3 font-[family-name:var(--font-body-sc)] text-h1 font-black">
        联系
      </h1>
      <p className="mt-4 max-w-2xl font-[family-name:var(--font-body-sc)] text-body text-muted">
        欢迎通过以下渠道联系我。完整简历信息请见{" "}
        <Link href="/about" className="text-accent underline-offset-4 hover:underline">
          关于页面
        </Link>
        。
      </p>

      <dl className="panel-card mt-8 grid gap-5 p-5 font-mono text-meta md:grid-cols-2 md:p-6">
        <div>
          <dt className="uppercase tracking-wider text-muted">Email</dt>
          <dd className="mt-1">
            <a
              href={`mailto:${profile.email}`}
              className="text-text transition-colors hover:text-accent"
            >
              {profile.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted">GitHub</dt>
          <dd className="mt-1">
            <a
              href={profile.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text transition-colors hover:text-accent"
            >
              {profile.github.href.replace("https://", "")}
            </a>
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted">LinkedIn</dt>
          <dd className="mt-1">
            <a
              href={profile.linkedIn.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text transition-colors hover:text-accent"
            >
              {profile.linkedIn.href.replace("https://", "")}
            </a>
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted">Resume</dt>
          <dd className="mt-1 text-muted">{profile.resumeDownload.label}</dd>
        </div>
      </dl>
    </div>
  );
}
