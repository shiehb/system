import { useEffect, useState, useCallback } from 'react';
import { getActivityLogs } from '@/endpoints/api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { 
  Search,
  ChevronDownIcon, 
  UserIcon,
  KeyIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  CircleCheckIcon,
  CircleXIcon
} from 'lucide-react';
import { format } from 'date-fns';

const actionIcons = {
  user_created: <UserPlusIcon className="w-4 h-4 mr-2" />,
  password_reset: <KeyIcon className="w-4 h-4 mr-2" />,
  status_changed: <CircleCheckIcon className="w-4 h-4 mr-2" />,
  user_updated: <PencilIcon className="w-4 h-4 mr-2" />,
  user_deleted: <TrashIcon className="w-4 h-4 mr-2" />,
  profile_updated: <UserIcon className="w-4 h-4 mr-2" />,
  avatar_updated: <UserIcon className="w-4 h-4 mr-2" />,
  login: <CircleCheckIcon className="w-4 h-4 mr-2" />,
  logout: <CircleXIcon className="w-4 h-4 mr-2" />,
};

const actionNames = {
  user_created: "User Created",
  password_reset: "Password Reset",
  status_changed: "Status Changed",
  user_updated: "User Updated",
  user_deleted: "User Deleted",
  profile_updated: "Profile Updated",
  avatar_updated: "Avatar Updated",
  login: "Login",
  logout: "Logout",
};

export default function ActivityLogs() {
  const [data, setData] = useState({
    logs: [] as ActivityLog[],
    count: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    search: '',
    page_size: 15,
  });

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getActivityLogs({
        ...filters,
        page: data.currentPage,
      });
      
      setData({
        logs: response.results,
        count: response.count,
        totalPages: response.total_pages,
        currentPage: response.current_page,
      });
    } catch (error) {
      console.error('Failed to fetch activity logs', error);
      setData(prev => ({ ...prev, logs: [] }));
    } finally {
      setLoading(false);
    }
  }, [filters, data.currentPage]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= data.totalPages) {
      setData(prev => ({ ...prev, currentPage: page }));
    }
  };


  // const formatDetails = (action: string, details: any) => {
  //   if (!details) return '';
    
  //   switch (action) {
  //     case 'user_created':
  //       return `Created user: ${details.id_number} (${details.email})`;
  //     case 'password_reset':
  //       return `Reset password for: ${details.id_number}`;
  //     case 'status_changed':
  //       return `From ${details.from} to ${details.to}`;
  //     case 'user_updated':
  //       return Object.keys(details.changes || {})
  //         .map(field => `${field}: ${details.changes[field].from} → ${details.changes[field].to}`)
  //         .join(', ');
  //     default:
  //       return JSON.stringify(details);
  //   }
  // };

    return (
    <Card className="h-[calc(100vh-150px)] w-full">
      <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
        <CardTitle>Activity Logs</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className='relative flex-1'>
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs by user"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className=" pl-8 w-full md:w-100"
          />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                {filters.action ? actionNames[filters.action as keyof typeof actionNames] : 'All Actions'} 
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilters({...filters, action: ''})}>
                All Actions
              </DropdownMenuItem>
              {Object.entries(actionNames).map(([key, name]) => (
                <DropdownMenuItem 
                  key={key} 
                  onClick={() => setFilters({...filters, action: key})}
                >
                  <div className="flex items-center">
                    {actionIcons[key as keyof typeof actionIcons]}
                    <span>{name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <ScrollArea className="h-[calc(100vh-315px)] flex-1 w-full">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>User</TableHead>
                  {/* <TableHead>Details</TableHead> */}
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="hover:bg-muted/50">
                    <TableCell colSpan={5} className="h-[calc(100vh-355px)] text-center">
                      Loading User logs...
                    </TableCell>
                  </TableRow>
                ) : data.logs.length === 0 ? (
                  <TableRow className="hover:bg-muted/50">
                    <TableCell colSpan={5} className="h-[calc(100vh-355px)] text-center">
                      No activity logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center">
                          {actionIcons[log.action as keyof typeof actionIcons] || <UserIcon className="w-4 h-4 mr-2" />}
                          <span>{actionNames[log.action as keyof typeof actionNames] || log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.admin 
                          ? `${log.admin.first_name} ${log.admin.last_name}` 
                          : 'System'}
                      </TableCell>
                      <TableCell>
                        {log.user 
                          ? `${log.user.first_name} ${log.user.last_name}` 
                          : 'N/A'}
                      </TableCell>
                      {/* <TableCell className="max-w-[300px] truncate">
                        {formatDetails(log.action, log.details)}
                      </TableCell> */}
                      <TableCell>
                        {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {data.totalPages > 1 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground select-none">
              Showing page {data.currentPage} of {data.totalPages}
            </div>
            <Pagination className="w-auto cursor-pointer ">
              <PaginationContent className='flex '>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => data.currentPage > 1 && handlePageChange(data.currentPage - 1)}
                    className={data.currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  let pageNum;
                  if (data.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (data.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (data.currentPage >= data.totalPages - 2) {
                    pageNum = data.totalPages - 4 + i;
                  } else {
                    pageNum = data.currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={pageNum === data.currentPage}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => data.currentPage < data.totalPages && handlePageChange(data.currentPage + 1)}
                    className={data.currentPage >= data.totalPages ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ActivityLog {
  id: number;
  admin: {
    id: number;
    id_number: string;
    first_name: string;
    last_name: string;
  } | null;
  user: {
    id: number;
    id_number: string;
    first_name: string;
    last_name: string;
  } | null;
  action: string;
  // details: any;
  created_at: string;
}