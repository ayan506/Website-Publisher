import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onMultipleChange?: (urls: string[]) => void;
  label?: string;
  className?: string;
  multiple?: boolean;
}

export function ImageUpload({ value, onChange, onMultipleChange, label = "Upload Image", className = "", multiple = false }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url as string;
  };

  const handleFiles = async (files: FileList | File[]) => {
    setError("");
    setUploading(true);
    try {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length === 0) return;
      const uploadedUrls = [];
      for (const file of selectedFiles) {
        uploadedUrls.push(await uploadFile(file));
      }
      if (multiple) {
        onMultipleChange?.(uploadedUrls);
        if (uploadedUrls[0]) onChange(uploadedUrls[0]);
      } else if (uploadedUrls[0]) {
        onChange(uploadedUrls[0]);
      }
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border bg-muted" style={{ aspectRatio: "4/3" }}>
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-black px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/90"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          {uploading ? (
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">
                Click or drag & drop • JPG, PNG, WebP (max 10MB{multiple ? " each" : ""})
              </p>
            </>
          )}
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); }}
      />
    </div>
  );
}
