import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchDepartments } from "@/store/departmentsSlice";
import { Pencil } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DeleteButton from "./DeleteButton";

function DepartmentsList({ isListView }) {
  const dispatch = useDispatch();
  const { departments, loading, error, hasFetched } = useSelector(
    (state) => state.departments,
  );

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchDepartments());
    }
  }, [dispatch, hasFetched]);

  const handleDepartmentDelete = () => { };
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
                  <TableCell>{department.employee_count || 0}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button asChild
                      aria-label="Edit Department" >
                      <Link to={`/edit-department/${department.id}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <DeleteButton
                      aria-label="Delete department"
                      departmentId={department.id}
                      departmentName={department.name}
                      onDelete={handleDepartmentDelete}
                    />
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
                  Employee: {department.employee_count || 0}
                </p>
                <div className="flex justify-end gap-2">
                  <Button asChild>
                    <Link to={`/edit-department/${department.id}`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <DeleteButton
                    departmentId={department.id}
                    departmentName={department.name}
                    onDelete={handleDepartmentDelete}
                  />
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
