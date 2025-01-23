import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';

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
      .select('settings.blacklist');

    return NextResponse.json(user?.settings?.blacklist || { users: [], renders: [] });
  } catch (error) {
    console.error('Kara liste getirme hatası:', error);
    return NextResponse.json(
      { error: 'Kara liste getirilemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { type, id, action } = await req.json();
    
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Kara liste ayarlarını başlat
    if (!user.settings) user.settings = {};
    if (!user.settings.blacklist) {
      user.settings.blacklist = {
        users: [],
        renders: []
      };
    }

    // Kara listeye ekle veya çıkar
    const listType = type === 'user' ? 'users' : 'renders';
    if (action === 'add') {
      if (!user.settings.blacklist[listType].includes(id)) {
        user.settings.blacklist[listType].push(id);
      }
    } else {
      user.settings.blacklist[listType] = user.settings.blacklist[listType]
        .filter((item: string) => item !== id);
    }

    await user.save();
    return NextResponse.json(user.settings.blacklist);
  } catch (error) {
    console.error('Kara liste güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Kara liste güncellenemedi' },
      { status: 500 }
    );
  }
} 