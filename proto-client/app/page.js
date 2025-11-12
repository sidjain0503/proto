'use client'
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import ProjectGrid from "@/components/view/projects/ProjectGrid";
import { LucidePlus } from "lucide-react";
import { useState } from "react";

const ProjectList =  [
  {
    id: 1,
    name: "AI Project 1",
    description: "Project 1 description",
  },
  {
    id: 2,
    name: "Automation Project 1",
    description: "Project 1 description",
  },
  {
    id: 3,
    name: "Expansion 1",
    description: "Project 1 description",
  },
];

export default function Home() {
  const [projects, setProjects] = useState(ProjectList);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    const filteredProjects = ProjectList.filter((project) => project.name.toLowerCase().includes(searchValue.toLowerCase()));
    setProjects(filteredProjects);
  };

  return (
    <div className="p-4 space-y-4">
     <div className="flex justify-between items-center gap-4">
      <Search placeholder="Search projects" className="flex-1" onChange={handleSearch}/>
      <Button size={"lg"}x className="rounded-full">
        <LucidePlus className="w-4 h-4" />
        Add Project
      </Button>
     </div>
      <ProjectGrid projects={projects} />
    </div>
  );
}
