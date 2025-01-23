import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any) as Session;
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Kullanıcıyı bul veya oluştur
    let user = await User.findOne({ email: session.user.email })
      .select('-password')
      .lean();

    if (!user) {
      try {
        // Yeni kullanıcı oluştur
        const newUser = new User({
          email: session.user.email,
          name: session.user.name || null,
          username: session.user.name || null,
          role: 'user',
          credits: 1000, // Başlangıç kredisi
          profilePhoto: '/images/pfp/duck.jpg', // Varsayılan profil fotoğrafı
          settings: {
            renderPreferences: {
              priority: 'normal'
            },
            notifications: {
              onComplete: true,
              onFail: true,
              onStart: false
            }
          }
        });

        await newUser.save();
        const savedUser = newUser.toObject();
        delete savedUser.password;
        return NextResponse.json(savedUser);
      } catch (error: any) {
        console.error('Kullanıcı oluşturma hatası:', error);
        return NextResponse.json(
          { error: 'Kullanıcı oluşturulamadı' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Profil getirme hatası:', error);
    return NextResponse.json(
      { error: 'Profil bilgileri alınamadı' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions as any) as Session;
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const data = await request.json();
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Email değişikliği
    if (data.email && data.email !== user.email) {
      // Email benzersizliğini kontrol et
      const existingEmail = await User.findOne({ email: data.email });
      if (existingEmail) {
        return NextResponse.json(
          { error: 'Bu email adresi zaten kullanılıyor' },
          { status: 409 }
        );
      }
      user.email = data.email;
    }

    // Kullanıcı adı değişikliği
    if (data.username && data.username !== user.username) {
      // Kullanıcı adı benzersizliğini kontrol et
      const existingUsername = await User.findOne({ username: data.username });
      if (existingUsername) {
        return NextResponse.json(
          { error: 'Bu kullanıcı adı zaten kullanılıyor' },
          { status: 409 }
        );
      }
      user.username = data.username;
    }

    // İsim değişikliği
    if (data.name) {
      user.name = data.name;
    }

    // Şifre değişikliği
    if (data.currentPassword && data.newPassword) {
      const userWithPassword = await User.findOne({ email: user.email }).select('+password');
      if (!userWithPassword?.password) {
        return NextResponse.json(
          { error: 'Şifre değiştirilemedi' },
          { status: 400 }
        );
      }

      // Mevcut şifreyi kontrol et
      const isValid = await userWithPassword.comparePassword(data.currentPassword);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Mevcut şifre yanlış' },
          { status: 400 }
        );
      }

      // Yeni şifre karmaşıklığını kontrol et
      if (data.newPassword.length < 8) {
        return NextResponse.json(
          { error: 'Yeni şifre en az 8 karakter olmalıdır' },
          { status: 400 }
        );
      }

      user.password = data.newPassword;
    }

    // Render tercihleri
    if (data.settings?.renderPreferences) {
      user.settings.renderPreferences = {
        ...user.settings.renderPreferences,
        ...data.settings.renderPreferences
      };
    }

    // Bildirim ayarları
    if (data.settings?.notifications) {
      user.settings.notifications = {
        ...user.settings.notifications,
        ...data.settings.notifications
      };
    }

    await user.save();

    // Hassas bilgileri kaldır
    const userObject = user.toObject();
    delete userObject.password;

    return NextResponse.json({
      message: 'Profil güncellendi',
      user: userObject
    });
  } catch (error: any) {
    console.error('Profil güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Profil güncellenemedi' },
      { status: 500 }
    );
  }
} 