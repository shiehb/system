"use client"

import { useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, File, ImageIcon, FileText, Download, Trash2, Eye, Search, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  category: "profile" | "inspection" | "report" | "certificate" | "other"
  url: string
  thumbnail?: string
}

interface DocumentManagerProps {
  onUpload: (files: FileList, category: string) => Promise<void>
  onDelete: (documentId: string) => Promise<void>
  onDownload: (document: Document) => Promise<void>
}

export const DocumentManager = ({ onUpload, onDelete, onDownload }: DocumentManagerProps) => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Profile_Picture.jpg",
      type: "image/jpeg",
      size: 2048000,
      uploadDate: new Date().toISOString(),
      category: "profile",
      url: "/api/documents/1",
    },
    {
      id: "2",
      name: "Inspection_Certificate.pdf",
      type: "application/pdf",
      size: 1024000,
      uploadDate: new Date(Date.now() - 86400000).toISOString(),
      category: "certificate",
      url: "/api/documents/2",
    },
    {
      id: "3",
      name: "Monthly_Report.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 512000,
      uploadDate: new Date(Date.now() - 172800000).toISOString(),
      category: "report",
      url: "/api/documents/3",
    },
  ])

  const [filteredDocuments, setFilteredDocuments] = useState(documents)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadCategory, setUploadCategory] = useState("other")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
    if (type === "application/pdf") return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "profile":
        return "bg-blue-100 text-blue-800"
      case "inspection":
        return "bg-green-100 text-green-800"
      case "report":
        return "bg-purple-100 text-purple-800"
      case "certificate":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await onUpload(files, uploadCategory)

      // Add uploaded files to documents list
      const newDocuments = Array.from(files).map((file, index) => ({
        id: `${Date.now()}_${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        category: uploadCategory as Document["category"],
        url: `/api/documents/${Date.now()}_${index}`,
      }))

      setDocuments((prev) => [...newDocuments, ...prev])
      setUploadProgress(100)

      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 1000)

      toast.success(`${files.length} file(s) uploaded successfully`)
    } catch (error) {
      setIsUploading(false)
      setUploadProgress(0)
      toast.error("Failed to upload files")
    }
  }

  const handleDelete = async (documentId: string) => {
    try {
      await onDelete(documentId)
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
      toast.success("Document deleted successfully")
    } catch (error) {
      toast.error("Failed to delete document")
    }
  }

  const handleDownload = async (document: Document) => {
    try {
      await onDownload(document)
      toast.success("Download started")
    } catch (error) {
      toast.error("Failed to download document")
    }
  }

  // Filter documents based on search and category
  useState(() => {
    let filtered = documents

    if (searchTerm) {
      filtered = filtered.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((doc) => doc.category === filterCategory)
    }

    setFilteredDocuments(filtered)
  }, [documents, searchTerm, filterCategory])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Document Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
            <p className="text-sm text-gray-500 mb-4">Drag and drop files here, or click to select files</p>

            <div className="flex items-center justify-center gap-4 mb-4">
              <Label htmlFor="category" className="text-sm font-medium">
                Category:
              </Label>
              <select
                id="category"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="profile">Profile</option>
                <option value="inspection">Inspection</option>
                <option value="report">Report</option>
                <option value="certificate">Certificate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Select Files"}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
            />

            {isUploading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-500 mt-2">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="profile">Profile</option>
              <option value="inspection">Inspection</option>
              <option value="report">Report</option>
              <option value="certificate">Certificate</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Documents List */}
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded">{getFileIcon(document.type)}</div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{document.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(document.category)}`}>
                          {document.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatFileSize(document.size)}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(document.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(document)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(document.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {filteredDocuments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No documents found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
