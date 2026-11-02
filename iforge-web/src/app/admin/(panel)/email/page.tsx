import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getMailSettings, toPublic, type PublicMailSettings } from "@/lib/settings";
import MailSettingsEditor from "../../MailSettingsEditor";

export const metadata = { title: "Email · Admin · iForge", robots: { index: false } };

export default async function EmailAdminPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  let settings: PublicMailSettings | null = null;
  let loadError = "";
  try {
    settings = toPublic(await getMailSettings());
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Couldn't load the email settings.";
  }
  return <MailSettingsEditor initial={settings} loadError={loadError} />;
}
