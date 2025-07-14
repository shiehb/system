"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { User } from "@/types";

interface ExportUsersButtonProps {
  selectedUserIds: number[];
  users?: User[];
  className?: string;
  children?: React.ReactNode;
}

export function ExportUsersButton({
  selectedUserIds,
  users = [],
  className,
  children,
}: ExportUsersButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportUsers = async (format: "csv" | "excel" | "pdf") => {
    try {
      setIsExporting(true);

      const usersToExport =
        selectedUserIds.length > 0
          ? users.filter((user) => selectedUserIds.includes(user.id))
          : users;

      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const formatLabels = {
        csv: "CSV",
        excel: "Excel",
        pdf: "PDF",
      };

      toast.success(`Export completed`, {
        description: `${usersToExport.length} users exported to ${formatLabels[format]} format`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description: "An error occurred while exporting users",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportCount =
    selectedUserIds.length > 0 ? selectedUserIds.length : users.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className} disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            children || (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export ({exportCount})
              </>
            )
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => exportUsers("csv")}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => exportUsers("excel")}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => exportUsers("pdf")}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ExportUsersButton;
