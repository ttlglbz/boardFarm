import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import SiteSettings from '../../../../models/SiteSettings';

export async function POST(req: Request) {
  try {
    console.log('Kayıt işlemi başlatılıyor...');
    
    // Veritabanı bağlantısı
    await dbConnect();
    console.log('Veritabanı bağlantısı başarılı');

    // Request body'i al
    const { username, email, password, role = 'user' } = await req.json();

    // Gerekli alanları kontrol et
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400 }
      );
    }

    // Şifre uzunluğunu kontrol et
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Şifre en az 8 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Email ve kullanıcı adının benzersiz olduğunu kontrol et
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email veya kullanıcı adı zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      username,
      email,
      password,
      role,
      joinDate: new Date(),
      lastLogin: new Date(),
      isActive: true
    });

    console.log('Kullanıcı başarıyla oluşturuldu:', user.email);

    // Hassas bilgileri çıkar
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { 
        message: 'Kayıt başarılı',
        user: userWithoutPassword
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { error: 'Kayıt işlemi başarısız: ' + error.message },
      { status: 500 }
    );
  }
} 