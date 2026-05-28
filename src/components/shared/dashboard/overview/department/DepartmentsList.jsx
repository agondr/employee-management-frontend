import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DepartmentsList({ isListView }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/departments/all`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }

        const data = await response.json();

        setDepartments(data);
        console.log(data);
      } catch (error) {
        console.log(error.message);
        setError(error.message || error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);
  return (
    <div>
      {loading && <p className="text-center">Loading departments....</p>}
      {error && <p className="text-center text-red-500"> Error: {error}</p>}
      {!loading && isListView && !error && departments.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => {
              return (
                <TableRow key={department.id}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.employee_list.length}</TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link to={`/edit-department/${department.id}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <h1>Delete</h1>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {!loading && !isListView && !error && departments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((department) => {
            return (
              <div
                key={department.id}
                className="p-4 border rounded-lg shadow-md bg-white"
              >
                <h2 className="text-lg font-bold capitalize mb-2">
                  {department.name}
                </h2>
                <p className="text-muted-foreground mb-4">
                  Employee: {department.employee_list.length}
                </p>
                <div className="flex justify-end gap-2">
                  <Button asChild>
                    <Link to={`/edit-department/${department.id}`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <h1>Delete</h1>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!loading && !error && departments.length === 0 && (
        <p className="text-center text-muted-foreground">
          No departments found
        </p>
      )}
    </div>
  );
}

export default DepartmentsList;
