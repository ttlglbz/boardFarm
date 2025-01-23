import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface SessionUser {
  email?: string;
  name?: string;
  role?: string;
}

interface Session {
  user?: SessionUser;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions as any) as Session;
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
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Sadece resim dosyaları yüklenebilir' },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 5MB\'dan büyük olamaz' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'pfp');
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);
    const photoUrl = `/images/pfp/${filename}`;

    // Veritabanını güncelle
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Eski profil fotoğrafını sil (varsayılan fotoğraf hariç)
    if (user.profilePhoto && !user.profilePhoto.endsWith('duck.jpg')) {
      try {
        const oldFilePath = path.join(process.cwd(), 'public', user.profilePhoto);
        await unlink(oldFilePath);
      } catch (error) {
        console.error('Eski profil fotoğrafı silinemedi:', error);
      }
    }

    user.profilePhoto = photoUrl;
    await user.save();

    return NextResponse.json({
      success: true,
      photoUrl
    });
  } catch (error: any) {
    console.error('Profil fotoğrafı yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Profil fotoğrafı yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions as any) as Session;
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Varsayılan fotoğrafı kontrol et
    if (user.profilePhoto.endsWith('duck.jpg')) {
      return NextResponse.json(
        { error: 'Varsayılan profil fotoğrafı silinemez' },
        { status: 400 }
      );
    }

    // Eski fotoğrafı sil
    try {
      const oldFilePath = path.join(process.cwd(), 'public', user.profilePhoto);
      await unlink(oldFilePath);
    } catch (error) {
      console.error('Profil fotoğrafı silinemedi:', error);
    }

    // Varsayılan fotoğrafa geri dön
    user.profilePhoto = '/images/pfp/duck.jpg';
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profil fotoğrafı silindi'
    });
  } catch (error: any) {
    console.error('Profil fotoğrafı silme hatası:', error);
    return NextResponse.json(
      { error: 'Profil fotoğrafı silinemedi' },
      { status: 500 }
    );
  }
} 