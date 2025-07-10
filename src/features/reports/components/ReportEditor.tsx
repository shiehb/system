"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Save,
  Send,
  MessageSquare,
  HighlighterIcon as Highlight,
  FileText,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit3,
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/useAuth"
import { reportApi } from "@/lib/reportApi"
import type { Report, ReportHighlight, ReportComment } from "@/types/reports"

interface ReportEditorProps {
  report?: Report
  onSave?: (report: Report) => void
  onSubmit?: (report: Report) => void
  readOnly?: boolean
}

export function ReportEditor({ report, onSave, onSubmit, readOnly = false }: ReportEditorProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: report?.title || "",
    content: report?.content || "",
    type: report?.type || "compliance",
    priority: report?.priority || "medium",
    due_date: report?.due_date || "",
  })

  const [highlights, setHighlights] = useState<ReportHighlight[]>(report?.highlights || [])
  const [comments, setComments] = useState<ReportComment[]>(report?.comments || [])
  const [selectedText, setSelectedText] = useState("")
  const [highlightComment, setHighlightComment] = useState("")
  const [newComment, setNewComment] = useState("")
  const [showHighlightDialog, setShowHighlightDialog] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const contentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (report) {
      loadReportData()
    }
  }, [report])

  const loadReportData = async () => {
    if (!report) return

    try {
      const [highlightsData, commentsData] = await Promise.all([
        reportApi.getReportHighlights(report.id),
        reportApi.getReportComments(report.id),
      ])

      setHighlights(highlightsData)
      setComments(commentsData)
    } catch (error) {
      console.error("Error loading report data:", error)
      toast.error("Failed to load report data")
    }
  }

  const handleTextSelection = () => {
    if (readOnly) return

    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim())
      setShowHighlightDialog(true)
    }
  }

  const handleAddHighlight = async () => {
    if (!selectedText || !highlightComment || !report) return

    try {
      const selection = window.getSelection()
      if (!selection || !selection.rangeCount) return

      const range = selection.getRangeAt(0)
      const highlightData = {
        section: "content",
        start_position: range.startOffset,
        end_position: range.endOffset,
        highlighted_text: selectedText,
        comment: highlightComment,
      }

      const newHighlight = await reportApi.addHighlight(report.id, highlightData)
      setHighlights([...highlights, newHighlight])

      setSelectedText("")
      setHighlightComment("")
      setShowHighlightDialog(false)

      toast.success("Highlight added successfully")
    } catch (error) {
      console.error("Error adding highlight:", error)
      toast.error("Failed to add highlight")
    }
  }

  const handleResolveHighlight = async (highlightId: number) => {
    if (!report) return

    try {
      const updatedHighlight = await reportApi.resolveHighlight(report.id, highlightId)
      setHighlights(highlights.map((h) => (h.id === highlightId ? updatedHighlight : h)))
      toast.success("Highlight resolved")
    } catch (error) {
      console.error("Error resolving highlight:", error)
      toast.error("Failed to resolve highlight")
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !report) return

    try {
      const comment = await reportApi.addComment(report.id, newComment.trim())
      setComments([...comments, comment])
      setNewComment("")
      toast.success("Comment added successfully")
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    }
  }

  const handleSave = async () => {
    if (!report) {
      // Create new report
      try {
        setLoading(true)
        const newReport = await reportApi.createReport(formData)
        onSave?.(newReport)
        toast.success("Report created successfully")
      } catch (error) {
        console.error("Error creating report:", error)
        toast.error("Failed to create report")
      } finally {
        setLoading(false)
      }
    } else {
      // Update existing report
      try {
        setLoading(true)
        const updatedReport = await reportApi.updateReport(report.id, formData)
        onSave?.(updatedReport)
        toast.success("Report saved successfully")
      } catch (error) {
        console.error("Error saving report:", error)
        toast.error("Failed to save report")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async () => {
    if (!report) return

    try {
      setLoading(true)
      const submittedReport = await reportApi.submitReport(report.id)
      onSubmit?.(submittedReport)
      setShowSubmitDialog(false)
      toast.success("Report submitted for review")
    } catch (error) {
      console.error("Error submitting report:", error)
      toast.error("Failed to submit report")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", icon: Edit3 },
      submitted: { color: "bg-blue-100 text-blue-800", icon: Send },
      under_review: { color: "bg-yellow-100 text-yellow-800", icon: Eye },
      needs_revision: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  const renderHighlightedContent = (content: string) => {
    if (!highlights.length) return content

    let highlightedContent = content
    highlights.forEach((highlight, index) => {
      const highlightClass = highlight.resolved
        ? "bg-green-200 line-through opacity-60"
        : "bg-yellow-200 cursor-pointer"

      highlightedContent = highlightedContent.replace(
        highlight.highlighted_text,
        `<span class="${highlightClass}" data-highlight-id="${highlight.id}" title="${highlight.comment}">${highlight.highlighted_text}</span>`,
      )
    })

    return highlightedContent
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {report ? `Report #${report.id}` : "New Report"}
              </CardTitle>
              {report && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Created by {report.created_by.first_name} {report.created_by.last_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {report && getStatusBadge(report.status)}
              {!readOnly && (
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={loading} variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  {report && report.status === "draft" && (
                    <Button onClick={() => setShowSubmitDialog(true)} disabled={loading}>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Report title"
                    disabled={readOnly}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eia_monitoring">EIA Monitoring</SelectItem>
                      <SelectItem value="air_quality">Air Quality</SelectItem>
                      <SelectItem value="water_quality">Water Quality</SelectItem>
                      <SelectItem value="solid_waste">Solid Waste</SelectItem>
                      <SelectItem value="toxic_hazardous">Toxic Hazardous</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Due Date</label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    disabled={readOnly}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  ref={contentRef}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  onMouseUp={handleTextSelection}
                  placeholder="Report content..."
                  className="min-h-[400px]"
                  disabled={readOnly}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Highlight className="h-4 w-4" />
                Highlights ({highlights.filter((h) => !h.resolved).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className={`p-3 rounded-lg border ${
                        highlight.resolved ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">"{highlight.highlighted_text}"</div>
                      <div className="text-xs text-muted-foreground mb-2">{highlight.comment}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          by {highlight.created_by.first_name} {highlight.created_by.last_name}
                        </span>
                        {!highlight.resolved && !readOnly && (
                          <Button size="sm" variant="outline" onClick={() => handleResolveHighlight(highlight.id)}>
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {highlights.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">No highlights yet</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] mb-4">
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3 rounded-lg bg-gray-50">
                      <div className="text-sm mb-1">{comment.content}</div>
                      <div className="text-xs text-muted-foreground">
                        by {comment.created_by.first_name} {comment.created_by.last_name} •{" "}
                        {new Date(comment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">No comments yet</div>
                  )}
                </div>
              </ScrollArea>

              {!readOnly && (
                <div className="space-y-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[80px]"
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm" className="w-full">
                    Add Comment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Highlight Dialog */}
      <Dialog open={showHighlightDialog} onOpenChange={setShowHighlightDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Highlight</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Selected Text</label>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">"{selectedText}"</div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <Textarea
                value={highlightComment}
                onChange={(e) => setHighlightComment(e.target.value)}
                placeholder="Add your feedback or suggestion..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowHighlightDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddHighlight} disabled={!highlightComment.trim()}>
                Add Highlight
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this report for review? Once submitted, you won't be able to edit it until
              it's returned for revision.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={loading}>
              Submit Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
