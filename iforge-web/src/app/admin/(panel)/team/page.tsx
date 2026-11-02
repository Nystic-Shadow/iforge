import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { loadContent } from "@/lib/content";
import TeamEditor from "../../TeamEditor";

export const metadata = { title: "Team · Admin · iForge", robots: { index: false } };

export default async function TeamAdminPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const { content, error } = await loadContent();
  return <TeamEditor initialTeam={content.team} initialPage={content.teamPage} loadError={error} />;
}
