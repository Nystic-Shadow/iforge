import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listInquiries } from "@/lib/inquiries";
import { storageMode, storageWarning } from "@/lib/content";
import { isAgentApiConfigured, isHermesWebhookConfigured } from "@/lib/hermes";
import { isEmailReady } from "@/lib/email";
import AdminShell from "../shell";

// Signed-in admin pages: one auth check and the live inbox feed for all of them.
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const [inquiries, emailEnabled] = await Promise.all([listInquiries().catch(() => []), isEmailReady()]);
  return (
    <AdminShell
      initialInquiries={inquiries}
      storageMode={storageMode}
      storageWarning={storageWarning}
      hermes={{ webhook: isHermesWebhookConfigured, agentApi: isAgentApiConfigured }}
      emailEnabled={emailEnabled}
    >
      {children}
    </AdminShell>
  );
}
