import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email })
      .select('settings.renderKeys');

    return NextResponse.json(user?.settings?.renderKeys || []);
  } catch (error) {
    console.error('Render anahtarları getirme hatası:', error);
    return NextResponse.json(
      { error: 'Render anahtarları getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
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

    // Yeni render anahtarı oluştur
    const newKey = {
      key: crypto.randomBytes(32).toString('hex'),
      createdAt: new Date(),
      lastUsed: null
    };

    // Kullanıcının render anahtarlarını güncelle
    if (!user.settings) user.settings = {};
    if (!user.settings.renderKeys) user.settings.renderKeys = [];
    user.settings.renderKeys.push(newKey);

    await user.save();
    return NextResponse.json(newKey);
  } catch (error) {
    console.error('Render anahtarı oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Render anahtarı oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { key } = await req.json();

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user?.settings?.renderKeys) {
      return NextResponse.json(
        { error: 'Render anahtarı bulunamadı' },
        { status: 404 }
      );
    }

    // Anahtarı sil
    user.settings.renderKeys = user.settings.renderKeys
      .filter((k: { key: string }) => k.key !== key);

    await user.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Render anahtarı silme hatası:', error);
    return NextResponse.json(
      { error: 'Render anahtarı silinemedi' },
      { status: 500 }
    );
  }
} 