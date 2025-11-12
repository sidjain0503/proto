import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const ProjectGrid = ({ projects = [] }) => {
  return (
    <div className="grid grid-cols-12 md:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
      {projects.map((project) => (
        <Card key={project.id} className="col-span-4 bg-none hover:bg-gray-100 hover:shadow-lg fade-in transition-1000 cursor-pointer">
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
          </CardContent>
          <CardFooter>
            <Button>View Project</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProjectGrid;
