import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IUser } from "@/types/general";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UsersTableProps {
  users: IUser[];
  currentPage: number;
  limit: number;
};

export const UsersTable = ({ users, currentPage, limit }: UsersTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="rounded-md border-none">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="px-8 text-center">No.</TableHead>
            <TableHead className="px-8 w-full">Name</TableHead>
            <TableHead className="text-center px-8">Phone</TableHead>
            <TableHead className="text-center px-8">Gender</TableHead>
            <TableHead className="px-8 text-center">Joined On</TableHead>
            <TableHead className="px-8 text-center">Status</TableHead>
            <TableHead className="px-8 text-center" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user._id}
              onClick={() => handleRowClick(user._id)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium px-8 text-center">
                {(currentPage - 1) * limit + index + 1}
              </TableCell>

              {user.name ? (
                <TableCell className="px-8 w-full max-w-0">
                  <span className="block truncate">
                    {user.name}
                  </span>
                </TableCell>
              ) : (
                <TableCell className="px-8 w-full max-w-0 text-red-500 text-xs">
                  N/A
                </TableCell>
              )}

              <TableCell className="text-center px-8">
                {user.phone}
              </TableCell>

              {user.gender ? (
                <TableCell className="text-center px-8 capitalize">
                  {user.gender.toLowerCase()}
                </TableCell>
              ) : (
                <TableCell className="text-center px-8 text-red-500 text-xs">
                  N/A
                </TableCell>
              )}

              <TableCell className="text-center px-8">
                {format(user.createdAt, "dd/LL/yyyy")}
              </TableCell>

              <TableCell className="text-center px-8 capitalize">
                <Badge variant={user.accountStatus === "ACTIVE" ? "success" : "warning"}>
                  {user.accountStatus.toLowerCase()}
                </Badge>
              </TableCell>

              <TableCell className="px-8 text-center">
                <Button size="icon-sm" variant="outline">
                  <ChevronRight />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};