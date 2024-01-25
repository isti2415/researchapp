import { useOrganization, clerkClient } from "@clerk/nextjs";
import Header from "@/components/Header";``
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/router";
import { Loader2Icon } from "lucide-react";
import AvatarGenerator from "@/components/createAvatar";

const Project = () => {
  const organization = useOrganization().organization;
  const router = useRouter();
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    if (organization) {
      const q = query(collection(db, "projects", organization.id, "papers"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const papersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setPapers(papersData);
      });

      // Cleanup function to unsubscribe when the component unmounts
      return () => unsubscribe();
    }
  }, [organization]);


  if (!papers || !organization) {
    return (
      <div className="fixed bottom-4 left-4 z-20">
        <Button variant="outline" size="icon">
          <Loader2Icon className="h-[1.2rem] w-[1.2rem] animate-spin transition-all" />
        </Button>
      </div>
    );
  }


  return (
    <div className="container mt-4">
      <Header />
      <div className="flex flex-col mt-4 gap-4">
        <div className="text-xl font-bold">{organization?.name}</div>
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="Details">
            <AccordionTrigger>Store Project Details</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4">
                <div className="text-xl font-bold">About the project</div>
                <div className="text-lg">Coming soon...</div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Notes">
            <AccordionTrigger>Store Project Notes and Ideas</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4">
                <div className="text-xl font-bold">Notes</div>
                <div className="text-lg">Coming soon...</div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Papers">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <div className="text-xl font-bold">Papers</div>
                <Link href={`/projects/${organization?.slug}/papers/new`} className={cn("mr-4", buttonVariants({ variant: "outline" }))}>
                  Add Paper
                </Link>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/12">Added By</TableHead>
                    <TableHead className="w-1/3">Title</TableHead>
                    <TableHead className="w-1/4">Publisher</TableHead>
                    <TableHead className="w-1/12">Year</TableHead>
                    <TableHead className="w-1/12">Country</TableHead>
                    <TableHead className="w-1/6">Read By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {papers.map((paper, index) => (
                    <TableRow key={index} onClick={() => router.push(`/projects/${organization?.slug}/papers/${paper?.id}`)} className="cursor-pointer">
                      <TableCell><AvatarGenerator fullname={paper.addedBy?.fullname} image={paper.addedBy?.image} /></TableCell>
                      <TableCell>{paper.title}</TableCell>
                      <TableCell>{paper.publisher}</TableCell>
                      <TableCell>{paper.year}</TableCell>
                      <TableCell>{paper.country}</TableCell>
                      <TableCell>{paper.readBy.map(user => (
                        <AvatarGenerator key={user.id} fullname={user.fullname} image={user.image} />
                      ))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div >
  );
};

export default Project;
