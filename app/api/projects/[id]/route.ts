import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await Promise.resolve(params);

    const project = await Project.findOne({
      _id: id,
      userId: session.user.email
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Proje getirme hatası:', error);
    return NextResponse.json(
      { error: 'Proje getirilemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const data = await request.json();
    await dbConnect();
    const { id } = await Promise.resolve(params);

    const project = await Project.findOne({
      _id: id,
      userId: session.user.email
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    // Sadece belirli alanların güncellenmesine izin ver
    const allowedUpdates = ['settings'];
    const updates = Object.keys(data).filter(key => allowedUpdates.includes(key));

    updates.forEach(update => {
      project[update] = data[update];
    });

    await project.save();

    return NextResponse.json(project);
  } catch (error) {
    console.error('Proje güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Proje güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await Promise.resolve(params);

    const project = await Project.findOne({
      _id: id,
      userId: session.user.email
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    // Proje durumunu kontrol et
    if (project.status === 'rendering') {
      return NextResponse.json(
        { error: 'Render edilmekte olan proje silinemez' },
        { status: 400 }
      );
    }

    await project.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Proje başarıyla silindi'
    });
  } catch (error) {
    console.error('Proje silme hatası:', error);
    return NextResponse.json(
      { error: 'Proje silinemedi' },
      { status: 500 }
    );
  }
} 