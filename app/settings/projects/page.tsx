import { addProjectAction, deleteProjectAction, editProjectAction } from "@/app/settings/actions"
import { CrudTable } from "@/components/settings/crud"
import { randomHexColor } from "@/lib/utils"
import { getProjects } from "@/models/projects"
import { Prisma } from "@prisma/client"

export default async function ProjectsSettingsPage() {
  const projects = await getProjects()
  const projectsWithActions = projects.map((project) => ({
    ...project,
    isEditable: true,
    isDeletable: true,
  }))

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-2">Projects</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-prose">
        Use projects to differentiate between the type of activities you do For example: Freelancing, YouTube channel,
        Blogging. Projects are just a convenient way to separate statistics.
      </p>
      <CrudTable
        items={projectsWithActions}
        columns={[
          { key: "name", label: "Name", editable: true },
          { key: "llm_prompt", label: "LLM Prompt", editable: true },
          { key: "color", label: "Color", defaultValue: randomHexColor(), editable: true },
        ]}
        onDelete={async (code) => {
          "use server"
          return await deleteProjectAction(code)
        }}
        onAdd={async (data) => {
          "use server"
          return await addProjectAction(data as Prisma.ProjectCreateInput)
        }}
        onEdit={async (code, data) => {
          "use server"
          return await editProjectAction(code, data as Prisma.ProjectUpdateInput)
        }}
      />
    </div>
  )
}
