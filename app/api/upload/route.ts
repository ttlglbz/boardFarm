import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya yüklenemedi' },
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et
    if (!file.name.endsWith('.blend')) {
      return NextResponse.json(
        { error: 'Sadece .blend dosyaları yüklenebilir' },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (1GB)
    if (file.size > 1024 * 1024 * 1000) {
      return NextResponse.json(
        { error: 'Dosya boyutu 1GB\'dan büyük olamaz' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Dosya adını oluştur: dosyaadı-kullanıcı-timestamp.blend
    const timestamp = Date.now();
    const originalName = file.name.replace('.blend', '');
    const username = session.user.email?.split('@')[0] || 'user';
    const filename = `${originalName}-${username}-${timestamp}.blend`;
    
    // Upload klasörünü oluştur
    const uploadDir = path.join(process.cwd(), 'public', 'blend', 'files');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      if ((error as any).code !== 'EEXIST') {
        throw error;
      }
    }
    
    // Dosyayı kaydet
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Veritabanına proje kaydet
    await dbConnect();
    const project = new Project({
      name: originalName,
      filename: filename,
      userId: session.user.email,
      status: 'uploaded',
      uploadDate: new Date(),
      filePath: `/blend/files/${filename}`,
      settings: {
        isAnimation: false,
        startFrame: 1,
        endFrame: 250,
        renderEngine: 'CYCLES',
        renderDevice: 'GPU',
        samples: 128,
        resolution: {
          x: 1920,
          y: 1080,
          percentage: 100
        }
      }
    });

    await project.save();

    return NextResponse.json({
      success: true,
      projectId: project._id,
      filename: filename,
      settings: project.settings
    });

  } catch (error: any) {
    console.error('Dosya yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenemedi' },
      { status: 500 }
    );
  }
} 