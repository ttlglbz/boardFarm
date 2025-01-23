import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadProfilePhoto, deleteProfilePhoto } from '@/lib/upload';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya yüklenmedi' }, { status: 400 });
    }

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Sadece resim dosyaları yüklenebilir' }, { status: 400 });
    }

    // Dosya boyutunu kontrol et (örn: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Dosya boyutu 5MB\'dan küçük olmalı' }, { status: 400 });
    }

    console.log('Dosya alındı:', { name: file.name, type: file.type, size: file.size });

    // Buffer'a dönüştür
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('Buffer oluşturuldu, boyut:', buffer.length);

    // Veritabanı bağlantısı
    await dbConnect();
    console.log('Veritabanı bağlantısı kuruldu');

    // Kullanıcıyı bul
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }
    console.log('Kullanıcı bulundu:', { id: user._id, email: user.email });

    // Eski fotoğrafı sil (varsayılan fotoğraf değilse)
    if (user.profilePhoto) {
      console.log('Eski fotoğraf siliniyor:', user.profilePhoto);
      await deleteProfilePhoto(user.profilePhoto);
    }

    // Yeni fotoğrafı yükle
    const photoUrl = await uploadProfilePhoto(buffer, file.name);
    console.log('Yeni fotoğraf yüklendi:', photoUrl);

    // Kullanıcı bilgilerini güncelle
    user.profilePhoto = photoUrl;
    const updatedUser = await user.save();

    console.log('Güncellenmiş kullanıcı:', {
      id: updatedUser._id,
      profilePhoto: updatedUser.profilePhoto,
      updatedAt: updatedUser.updatedAt
    });

    return NextResponse.json({ 
      success: true, 
      photoUrl,
      previousPhoto: user.profilePhoto,
      currentPhoto: updatedUser.profilePhoto
    });
  } catch (error) {
    console.error('Profil fotoğrafı yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Profil fotoğrafı yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    if (user.profilePhoto) {
      await deleteProfilePhoto(user.profilePhoto);
      user.profilePhoto = undefined;
      await user.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profil fotoğrafı silme hatası:', error);
    return NextResponse.json(
      { error: 'Profil fotoğrafı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 