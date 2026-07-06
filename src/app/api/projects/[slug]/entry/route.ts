import { NextResponse } from "next/server";
import {
  getProjectAnalyzerEntry,
  hasProjectAnalyzer,
} from "@/data/projects";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const path = new URL(request.url).searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path query parameter." }, { status: 400 });
  }

  if (!hasProjectAnalyzer(slug)) {
    return NextResponse.json({ error: "Project analyzer not found." }, { status: 404 });
  }

  const entry = getProjectAnalyzerEntry(slug, path);

  if (!entry) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  return NextResponse.json({ entry });
}
