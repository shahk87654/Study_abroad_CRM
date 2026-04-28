import { DocumentsWorkspace } from "@/components/documents/documents-workspace";
import { Topbar } from "@/components/layout/topbar";
import { getDocuments } from "@/lib/queries/documents";
import { getStudents } from "@/lib/queries/students";

export default async function DocumentsPage() {
  const [documents, students] = await Promise.all([getDocuments(), getStudents()]);

  return (
    <main className="crm-shell min-h-screen">
      <Topbar title="Documents" subtitle="Secure document intake, review, and signed downloads." />
      <div className="px-4 py-6 lg:px-8">
        <DocumentsWorkspace documents={documents} students={students} />
      </div>
    </main>
  );
}
