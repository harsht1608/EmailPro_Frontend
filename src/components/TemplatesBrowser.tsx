import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Folder, FileText, Copy, Eye, FolderOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTemplate } from "@/context/TemplateContext";

interface TemplateFile {
  filename: string
  subject: string
  message: string
  variables: string[]
  category?: string
}

interface TemplateFolder {
  name: string
  files: string[]
  children?: TemplateFolder[]
}

const TemplatesBrowser = () => {
  const [templateStructure, setTemplateStructure] = useState<TemplateFolder[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateFile | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const { setSelectedTemplate: setContextSelectedTemplate } = useTemplate();

  // Fetch template structure from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/email-templates")
        const data = await res.json()
        // Convert backend structure to array of TemplateFolder
        const folders: TemplateFolder[] = []
        if (data.templates) {
          Object.entries(data.templates).forEach(([name, folderObj]) => {
            folders.push({
              name,
              ...folderObj as any
            })
          })
        }
        setTemplateStructure(folders)
        // Expand all top-level folders by default
        setExpandedFolders(new Set(folders.map(f => f.name)))
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load templates"
        })
      }
    }
    fetchTemplates()
    // eslint-disable-next-line
  }, [])

  // Helper to recursively render folders and files
  const renderFolder = (folder: any, parentPath = '') => {
    const folderPath = parentPath ? `${parentPath}/${folder.name}` : folder.name
    return (
      <div key={folderPath} className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start p-2 h-auto"
          onClick={() => toggleFolder(folderPath)}
        >
          <div className="flex items-center space-x-2">
            {expandedFolders.has(folderPath) ? (
              <FolderOpen className="w-4 h-4 text-primary" />
            ) : (
              <Folder className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="font-medium">{folder.name}</span>
            <Badge variant="secondary" className="ml-auto">
              {(folder.files?.length || 0) + (folder.children ? folder.children.reduce((acc: number, child: any) => acc + (child.files?.length || 0), 0) : 0)}
            </Badge>
          </div>
        </Button>
        {expandedFolders.has(folderPath) && (
          <div className="ml-6 space-y-1">
            {folder.files && folder.files.map((filename: string) => (
              <Button
                key={filename}
                variant={selectedTemplate?.filename === filename ? "default" : "ghost"}
                className="w-full justify-start p-2 h-auto"
                onClick={() => handleSelectTemplate(filename)}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{filename}</span>
                </div>
              </Button>
            ))}
            {folder.children && folder.children.map((child: any) => renderFolder(child, folderPath))}
          </div>
        )}
      </div>
    )
  }

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderName)) newSet.delete(folderName)
      else newSet.add(folderName)
      return newSet
    })
  }

  // Fetch template content from backend when a file is selected
  const handleSelectTemplate = async (filename: string) => {
    if (!filename) return; // Prevent undefined fetch
    try {
      const res = await fetch(`/email-templates/${filename}`);
      if (!res.ok) throw new Error("Template not found");
      const data = await res.json();
      setSelectedTemplate(data);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load template content"
      });
      setSelectedTemplate(null);
    }
  }

  const handleUseTemplate = () => {
    if (!selectedTemplate) return;
    setContextSelectedTemplate({
      subject: selectedTemplate.subject,
      message: selectedTemplate.message,
      filename: selectedTemplate.filename,
      variables: selectedTemplate.variables,
    });
    toast({
      title: "Template Selected",
      description: "Switch to Send Email tab to use this template"
    });
  }

  const handleCopyTemplate = () => {
    if (!selectedTemplate) return;
    navigator.clipboard.writeText(selectedTemplate.message);
    toast({
      title: "Template Copied!",
      description: "Template body has been copied to clipboard"
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Template Browser */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Folder className="w-5 h-5 text-primary" />
            <span>Email Templates</span>
          </CardTitle>
          <CardDescription>
            Browse and manage your email templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {templateStructure.map(folder => renderFolder(folder))}
          </div>
        </CardContent>
      </Card>

      {/* Template Preview */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-primary" />
            <span>Template Preview</span>
          </CardTitle>
          <CardDescription>
            {selectedTemplate ? `Viewing: ${selectedTemplate.filename}` : 'Select a template to preview'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedTemplate ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <div className="p-3 bg-muted rounded-md">
                  <code className="text-sm">{selectedTemplate.subject}</code>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={selectedTemplate.message}
                  readOnly
                  rows={10}
                  className="font-mono text-sm bg-muted"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Variables</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable) => (
                    <Badge key={variable} variant="outline">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleCopyTemplate} variant="outline" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Template
                </Button>
                <Button onClick={handleUseTemplate} className="flex-1 shadow-elegant">
                  <FileText className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a template from the browser to preview its content</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TemplatesBrowser