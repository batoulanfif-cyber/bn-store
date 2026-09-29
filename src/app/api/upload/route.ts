import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/requireAdmin';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB — phone photos
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

// Uploads need request cookies + filesystem/Cloudinary: never prerender at build time.
export const dynamic = 'force-dynamic';

function useCloudinary(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  const { v2: cloudinary } = await import('cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'bn-store', resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve(result as { secure_url: string }))
    );
    stream.end(buffer);
  });
  return result.secure_url;
}

async function uploadLocal(buffer: Buffer, filename: string): Promise<string> {
  const dir = join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'Aucun fichier reçu' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'Image trop lourde (max 5 Mo)' }, { status: 400 });
    }
    if (file.type && !ALLOWED.includes(file.type) && !file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Format image uniquement' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Production (Vercel, etc.): ephemeral filesystem → use Cloudinary.
    // Local dev without Cloudinary keys: store in public/uploads.
    let url: string;
    if (useCloudinary()) {
      url = await uploadToCloudinary(buffer);
    } else {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().slice(0, 5);
      const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
      const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${safeExt}`;
      url = await uploadLocal(buffer, filename);
    }

    return NextResponse.json({ success: true, data: { url } }, { status: 201 });
  } catch (e) {
    console.error('POST /api/upload error:', e);
    return NextResponse.json({ success: false, error: 'Échec de l’envoi' }, { status: 500 });
  }
}
