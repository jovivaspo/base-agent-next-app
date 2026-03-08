---
name: cloudinary
description: >
  Cloudinary image upload and transformation patterns.
  Trigger: When working with image uploads, storage, or transformations using Cloudinary.
  Use for user avatars, product images, content media in Next.js apps.
  Client files go in: app/lib/cloudinary/
license: Apache-2.0
metadata:
  author: next-agent-template
  version: "1.0"
  scope: [root, app]
  auto_invoke:
    - "Adding image upload"
    - "Working with Cloudinary"
    - "Configuring image transformations"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Installation

```bash
pnpm add cloudinary
```

---

## Basic Upload (Server Side)

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }
```

### Upload from File Buffer

```typescript
// app/actions/upload.ts
'use server'
import { cloudinary } from '@/lib/cloudinary'

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'products', // Organize by folder
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })

  return result
}
```

### Upload from URL

```typescript
export async function uploadFromUrl(url: string) {
  const result = await cloudinary.uploader.upload(url, {
    folder: 'products',
    resource_type: 'image',
  })

  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
  }
}
```

---

## Signed Uploads (More Secure)

Generate signature on server, upload on client:

```typescript
// app/actions/sign-upload.ts
'use server'
import { v2 as cloudinary } from 'cloudinary'

export async function generateSignature(folder: string = 'uploads') {
  const timestamp = Math.round(new Date().getTime() / 1000)

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    signature,
    timestamp,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
  }
}
```

```typescript
// app/components/ImageUploader.tsx
'use client'

import { useState } from 'react'

export function ImageUploader() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    // Get signature from server
    const signResponse = await fetch('/api/sign-upload', {
      method: 'POST',
      body: JSON.stringify({ folder: 'products' }),
    })
    const { signature, timestamp, cloudName, apiKey, folder } = 
      await signResponse.json()

    // Upload directly to Cloudinary
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    formData.append('folder', folder)

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    )

    const data = await uploadResponse.json()
    setResult(data.secure_url)
    setUploading(false)
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p>Uploading...</p>}
      {result && <img src={result} alt="Uploaded" />}
    </div>
  )
}
```

---

## Image Optimizations

### Responsive Images with next/image

```typescript
// app/components/CloudinaryImage.tsx
'use client'

import Image from 'next/image'

interface Props {
  publicId: string
  alt: string
  width?: number
  height?: number
  crop?: string
  quality?: string | number
}

export function CloudinaryImage({
  publicId,
  alt,
  width = 800,
  height,
  crop = 'fill',
  quality = 'auto',
}: Props) {
  // Build Cloudinary URL with transformations
  const src = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_${crop},w_${width}${height ? `,h_${height}` : ''},q_${quality}/${publicId}`

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height || 600}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )
}
```

### Common Transformations

```typescript
// Transformation presets
const presets = {
  thumbnail: 'c_fill,w_200,h_200,g_auto',
  card: 'c_fill,w_400,h_300,g_auto',
  hero: 'c_fill,w_1200,h_600,g_auto',
  avatar: 'c_fill,w_150,h_150,g_auto,r_max',
  webp: 'f_webp,q_auto', // Auto format & quality
}

// Usage
const url = cloudinary.url(publicId, {
  transformation: [
    { width: 800, height: 600, crop: 'fill', gravity: 'auto' },
    { quality: 'auto', fetch_format: 'auto' },
  ],
})
```

---

## Delete Image

```typescript
// app/actions/delete-image.ts
'use server'
import { cloudinary } from '@/lib/cloudinary'

export async function deleteImage(publicId: string) {
  const result = await cloudinary.uploader.destroy(publicId)
  return result.result === 'ok'
}
```

---

## Bulk Delete (Products)

```typescript
export async function deleteImages(publicIds: string[]) {
  const result = await cloudinary.api.delete_resources(publicIds)
  return result.deleted
}
```

---

## Best Practices

```typescript
// ✅ ALWAYS: Use signed uploads for user-generated content
// Prevents unauthorized uploads

// ✅ ALWAYS: Specify folder to organize media
cloudinary.uploader.upload(file, { folder: 'products' })

// ✅ ALWAYS: Use auto format and quality
{ fetch_format: 'auto', quality: 'auto' }

// ✅ ALWAYS: Use next/image with Cloudinary URLs
// Enables lazy loading, blur placeholders, etc.

// ✅ ALWAYS: Set max file size on upload
{ max_file_size: 5_000_000 } // 5MB

// ✅ NEVER: Store full URLs in DB
// Store public_id only, build URLs dynamically

// ✅ NEVER: Expose API_SECRET to client
// Only use in server-side code
```

---

## Transformation Cheatsheet

| Code | Meaning |
|------|---------|
| `c_fill` | Crop to fill dimensions |
| `c_fit` | Fit within dimensions |
| `c_scale` | Scale to dimensions |
| `w_800` | Width 800 |
| `h_600` | Height 600 |
| `g_auto` | Auto-detect subject (faces, etc.) |
| `q_auto` | Auto quality |
| `f_auto` | Auto format (webp, avif) |
| `r_max` | Max round corners |
| `e_contrast` | Increase contrast |
| `e_grayscale` | Convert to grayscale |
