// import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
// import type {
//   Report,
//   ReportHighlight,
//   ReportComment,
//   EstablishmentForwarding,
//   ReportTemplate,
// } from "@/types/reports";

// // Report Management API
// export const reportApi = {
//   // Get reports with filtering
//   getReports: async (params?: {
//     status?: string;
//     type?: string;
//     assigned_to?: number;
//     created_by?: number;
//     page?: number;
//     page_size?: number;
//     search?: string;
//   }): Promise<{
//     results: Report[];
//     count: number;
//     total_pages: number;
//     current_page: number;
//     has_next: boolean;
//     has_previous: boolean;
//   }> => {
//     const queryParams = new URLSearchParams();
//     if (params) {
//       Object.entries(params).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           queryParams.append(key, value.toString());
//         }
//       });
//     }

//     const url = `reports/${
//       queryParams.toString() ? `?${queryParams.toString()}` : ""
//     }`;
//     return apiGet(url);
//   },

//   // Get single report
//   getReport: async (reportId: number): Promise<Report> => {
//     return apiGet(`reports/${reportId}/`);
//   },

//   // Create new report
//   createReport: async (reportData: Partial<Report>): Promise<Report> => {
//     return apiPost("reports/", reportData);
//   },

//   // Update report
//   updateReport: async (
//     reportId: number,
//     reportData: Partial<Report>
//   ): Promise<Report> => {
//     return apiPatch(`reports/${reportId}/`, reportData);
//   },

//   // Delete report
//   deleteReport: async (reportId: number): Promise<void> => {
//     return apiDelete(`reports/${reportId}/`);
//   },

//   // Submit report for review
//   submitReport: async (reportId: number): Promise<Report> => {
//     return apiPost(`reports/${reportId}/submit/`);
//   },

//   // Approve report
//   approveReport: async (
//     reportId: number,
//     comments?: string
//   ): Promise<Report> => {
//     return apiPost(`reports/${reportId}/approve/`, { comments });
//   },

//   // Reject report
//   rejectReport: async (reportId: number, reason: string): Promise<Report> => {
//     return apiPost(`reports/${reportId}/reject/`, { reason });
//   },

//   // Return report for revision
//   returnForRevision: async (
//     reportId: number,
//     highlights: Omit<
//       ReportHighlight,
//       | "id"
//       | "report_id"
//       | "created_by"
//       | "created_at"
//       | "resolved"
//       | "resolved_at"
//     >[],
//     comments: string
//   ): Promise<Report> => {
//     return apiPost(`reports/${reportId}/return-for-revision/`, {
//       highlights,
//       comments,
//     });
//   },

//   // Get report highlights
//   getReportHighlights: async (reportId: number): Promise<ReportHighlight[]> => {
//     return apiGet(`reports/${reportId}/highlights/`);
//   },

//   // Add highlight to report
//   addHighlight: async (
//     reportId: number,
//     highlightData: Omit<
//       ReportHighlight,
//       | "id"
//       | "report_id"
//       | "created_by"
//       | "created_at"
//       | "resolved"
//       | "resolved_at"
//     >
//   ): Promise<ReportHighlight> => {
//     return apiPost(`reports/${reportId}/highlights/`, highlightData);
//   },

//   // Resolve highlight
//   resolveHighlight: async (
//     reportId: number,
//     highlightId: number
//   ): Promise<ReportHighlight> => {
//     return apiPatch(`reports/${reportId}/highlights/${highlightId}/resolve/`);
//   },

//   // Get report comments
//   getReportComments: async (reportId: number): Promise<ReportComment[]> => {
//     return apiGet(`reports/${reportId}/comments/`);
//   },

//   // Add comment to report
//   addComment: async (
//     reportId: number,
//     content: string,
//     parentCommentId?: number
//   ): Promise<ReportComment> => {
//     return apiPost(`reports/${reportId}/comments/`, {
//       content,
//       parent_comment_id: parentCommentId,
//     });
//   },

//   // Upload report attachment
//   uploadAttachment: async (reportId: number, file: File): Promise<any> => {
//     const formData = new FormData();
//     formData.append("file", file);

//     return apiPost(`reports/${reportId}/attachments/`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   },

//   // Get reports assigned to current user
//   getMyReports: async (status?: string): Promise<Report[]> => {
//     const url = `reports/my-reports/${status ? `?status=${status}` : ""}`;
//     return apiGet(url);
//   },

//   // Get reports created by current user
//   getMyCreatedReports: async (status?: string): Promise<Report[]> => {
//     const url = `reports/my-created-reports/${
//       status ? `?status=${status}` : ""
//     }`;
//     return apiGet(url);
//   },

//   // Get report templates
//   getReportTemplates: async (type?: string): Promise<ReportTemplate[]> => {
//     const url = `report-templates/${type ? `?type=${type}` : ""}`;
//     return apiGet(url);
//   },

//   // Create report from template
//   createFromTemplate: async (
//     templateId: number,
//     reportData: Partial<Report>
//   ): Promise<Report> => {
//     return apiPost(`report-templates/${templateId}/create-report/`, reportData);
//   },
// };

// // Establishment Forwarding API
// export const forwardingApi = {
//   // Get forwarded establishments
//   getForwardedEstablishments: async (params?: {
//     status?: string;
//     forwarded_to?: number;
//     forwarded_from?: number;
//     priority?: string;
//     page?: number;
//     page_size?: number;
//   }): Promise<{
//     results: EstablishmentForwarding[];
//     count: number;
//     total_pages: number;
//     current_page: number;
//     has_next: boolean;
//     has_previous: boolean;
//   }> => {
//     const queryParams = new URLSearchParams();
//     if (params) {
//       Object.entries(params).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           queryParams.append(key, value.toString());
//         }
//       });
//     }

//     const url = `establishment-forwarding/${
//       queryParams.toString() ? `?${queryParams.toString()}` : ""
//     }`;
//     return apiGet(url);
//   },

//   // Forward establishment
//   forwardEstablishment: async (forwardingData: {
//     establishment_id: number;
//     forwarded_to: number;
//     forwarding_reason: string;
//     priority: "low" | "medium" | "high" | "urgent";
//     due_date?: string;
//     notes?: string;
//   }): Promise<EstablishmentForwarding> => {
//     return apiPost("establishment-forwarding/", forwardingData);
//   },

//   // Accept forwarded establishment
//   acceptForwarding: async (
//     forwardingId: number,
//     notes?: string
//   ): Promise<EstablishmentForwarding> => {
//     return apiPost(`establishment-forwarding/${forwardingId}/accept/`, {
//       notes,
//     });
//   },

//   // Complete forwarded establishment
//   completeForwarding: async (
//     forwardingId: number,
//     notes?: string
//   ): Promise<EstablishmentForwarding> => {
//     return apiPost(`establishment-forwarding/${forwardingId}/complete/`, {
//       notes,
//     });
//   },

//   // Reject forwarded establishment
//   rejectForwarding: async (
//     forwardingId: number,
//     reason: string
//   ): Promise<EstablishmentForwarding> => {
//     return apiPost(`establishment-forwarding/${forwardingId}/reject/`, {
//       reason,
//     });
//   },

//   // Get establishments assigned to current user
//   getMyForwardedEstablishments: async (
//     status?: string
//   ): Promise<EstablishmentForwarding[]> => {
//     const url = `establishment-forwarding/my-assignments/${
//       status ? `?status=${status}` : ""
//     }`;
//     return apiGet(url);
//   },

//   // Get available personnel for forwarding
//   getAvailablePersonnel: async (establishmentType?: string): Promise<any[]> => {
//     const url = `users/available-personnel/${
//       establishmentType ? `?type=${establishmentType}` : ""
//     }`;
//     return apiGet(url);
//   },
// };

// export default { reportApi, forwardingApi };
