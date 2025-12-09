import React, { useCallback } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  icon?: 'image' | 'doc';
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  accept, 
  files, 
  onFilesChange,
  icon = 'image'
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-wrap gap-4">
        {files.map((file, index) => (
          <div key={index} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
             {file.type.startsWith('image/') ? (
               <img 
                 src={URL.createObjectURL(file)} 
                 alt="preview" 
                 className="w-full h-full object-cover" 
               />
             ) : (
               <div className="text-slate-400 flex flex-col items-center p-2 text-xs text-center">
                 <FileText size={24} />
                 <span className="mt-1 truncate w-full">{file.name}</span>
               </div>
             )}
            <button
              onClick={() => removeFile(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        
        <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors">
          {icon === 'image' ? <ImageIcon className="text-slate-400" /> : <FileText className="text-slate-400" />}
          <span className="text-xs text-slate-500 mt-1">Add</span>
          <input 
            type="file" 
            className="hidden" 
            accept={accept} 
            multiple 
            onChange={handleFileChange} 
          />
        </label>
      </div>
    </div>
  );
};
