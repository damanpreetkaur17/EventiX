"use client";

import { useState } from "react";
import Image from "next/image";
import { useProfile } from "@/lib/profile";
import type { UserProfile } from "@/lib/profile";

interface AvatarUploadProps {
  token: string;
  currentAvatar?: string | null;
  onSuccess?: (profile: UserProfile) => void;
  onError?: (error: string) => void;
}

export default function AvatarUpload({
  token,
  currentAvatar,
  onSuccess,
  onError,
}: AvatarUploadProps) {
  const { uploadAvatar, loading, error } = useProfile(token);
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      onError?.("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError?.("File must be smaller than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    const result = await uploadAvatar(file);
    if (result) {
      onSuccess?.(result);
    } else {
      onError?.(error || "Failed to upload avatar");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Profile Picture</h2>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      <div
        className={`mb-6 p-8 border-2 border-dashed rounded-lg transition ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <Image
                src={preview}
                alt="Avatar preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-600">Click below to change</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="font-medium text-gray-700">Drag and drop or click to upload</p>
            <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
          </div>
        )}
      </div>

      <label className="block">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          disabled={loading}
          className="hidden"
        />
        <button
          type="button"
          onClick={(e) => {
            const input = e.currentTarget.parentElement?.querySelector('input[type="file"]');
            if (input instanceof HTMLInputElement) {
              input.click();
            }
          }}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
        >
          {loading ? "Uploading..." : "Select Image"}
        </button>
      </label>

      <p className="text-xs text-gray-500 mt-4">
        Recommended: Square image, at least 400x400px
      </p>
    </div>
  );
}
