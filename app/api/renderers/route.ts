import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Renderer from '@/models/Renderer';
import { authOptions } from '../auth/[...nextauth]/route';

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

    const renderers = await Renderer.find({
      userId: session.user.email
    })
      .sort({ lastSeen: -1 })
      .lean();

    return NextResponse.json({
      renderers,
      total: renderers.length,
    });
  } catch (error: any) {
    console.error('Renderer listesi getirme hatası:', error);
    return NextResponse.json(
      { error: 'Renderer listesi alınamadı' },
      { status: 500 }
    );
  }
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

    const data = await request.json();
    await dbConnect();

    // API anahtarı oluştur
    const apiKey = crypto.randomBytes(32).toString('hex');

    const renderer = new Renderer({
      ...data,
      userId: session.user.email,
      status: 'online',
      lastSeen: new Date(),
      apiKey,
      version: '1.0.0'
    });

    await renderer.save();

    return NextResponse.json({
      message: 'Renderer başarıyla oluşturuldu',
      renderer,
    });
  } catch (error: any) {
    console.error('Renderer oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Renderer oluşturulamadı' },
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

    const { searchParams } = new URL(request.url);
    const rendererId = searchParams.get('id');

    if (!rendererId) {
      return NextResponse.json(
        { error: 'Renderer ID\'si gerekli' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Renderer'ı ve sahibini kontrol et
    const renderer = await Renderer.findOne({
      _id: rendererId
    });

    if (!renderer) {
      return NextResponse.json(
        { error: 'Renderer bulunamadı' },
        { status: 404 }
      );
    }

    // Renderer'ın sahibi olup olmadığını kontrol et
    if (renderer.userId !== session.user.email) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    // Renderer'ın durumunu kontrol et
    if (renderer.status === 'busy') {
      return NextResponse.json(
        { error: 'Çalışan bir renderer silinemez' },
        { status: 400 }
      );
    }

    await renderer.deleteOne();

    return NextResponse.json({
      message: 'Renderer başarıyla silindi'
    });
  } catch (error: any) {
    console.error('Renderer silme hatası:', error);
    return NextResponse.json(
      { error: 'Renderer silinemedi' },
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

    const { searchParams } = new URL(request.url);
    const rendererId = searchParams.get('id');

    if (!rendererId) {
      return NextResponse.json(
        { error: 'Renderer ID\'si gerekli' },
        { status: 400 }
      );
    }

    const data = await request.json();
    await dbConnect();

    // Renderer'ı ve sahibini kontrol et
    const renderer = await Renderer.findOne({
      _id: rendererId
    });

    if (!renderer) {
      return NextResponse.json(
        { error: 'Renderer bulunamadı' },
        { status: 404 }
      );
    }

    // Renderer'ın sahibi olup olmadığını kontrol et
    if (renderer.userId !== session.user.email) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    // Renderer'ın durumunu kontrol et
    if (renderer.status === 'busy' && data.status !== 'maintenance') {
      return NextResponse.json(
        { error: 'Çalışan bir renderer düzenlenemez' },
        { status: 400 }
      );
    }

    // Güncellenebilir alanları kontrol et
    const allowedUpdates = ['name', 'specs', 'settings', 'maintenance'];
    const updates = Object.keys(data).filter(key => allowedUpdates.includes(key));

    // Sadece izin verilen alanları güncelle
    updates.forEach(update => {
      renderer[update] = data[update];
    });

    await renderer.save();

    return NextResponse.json({
      message: 'Renderer başarıyla güncellendi',
      renderer
    });
  } catch (error: any) {
    console.error('Renderer güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Renderer güncellenemedi' },
      { status: 500 }
    );
  }
} 