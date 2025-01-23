import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import { authOptions } from '../auth/[...nextauth]/route';

interface SessionUser {
  email?: string;
  name?: string;
  role?: string;
}

interface Session {
  user?: SessionUser;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions as any) as Session;
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    await dbConnect();

    const query = {
      userId: session.user?.email,
      ...(status && { status }),
    };

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalJobs,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    console.error('İş listesi getirme hatası:', error);
    return NextResponse.json(
      { error: 'İş listesi alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions as any) as Session;
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const data = await request.json();
    await dbConnect();

    const job = new Job({
      ...data,
      userId: session.user?.email,
      status: 'pending',
    });

    await job.save();

    return NextResponse.json({
      message: 'İş başarıyla oluşturuldu',
      job,
    });
  } catch (error: any) {
    console.error('İş oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'İş oluşturulamadı' },
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
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json(
        { error: 'İş ID\'si gerekli' },
        { status: 400 }
      );
    }

    await dbConnect();

    // İşi ve sahibini kontrol et
    const job = await Job.findOne({
      _id: jobId
    });

    if (!job) {
      return NextResponse.json(
        { error: 'İş bulunamadı' },
        { status: 404 }
      );
    }

    // İşin sahibi olup olmadığını kontrol et
    if (job.userId !== session.user.email) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    // İşin durumunu kontrol et
    if (job.status === 'processing') {
      return NextResponse.json(
        { error: 'İşlem devam eden bir iş silinemez' },
        { status: 400 }
      );
    }

    await job.deleteOne();

    return NextResponse.json({
      message: 'İş başarıyla silindi'
    });
  } catch (error: any) {
    console.error('İş silme hatası:', error);
    return NextResponse.json(
      { error: 'İş silinemedi' },
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
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json(
        { error: 'İş ID\'si gerekli' },
        { status: 400 }
      );
    }

    const data = await request.json();
    await dbConnect();

    // İşi ve sahibini kontrol et
    const job = await Job.findOne({
      _id: jobId
    });

    if (!job) {
      return NextResponse.json(
        { error: 'İş bulunamadı' },
        { status: 404 }
      );
    }

    // İşin sahibi olup olmadığını kontrol et
    if (job.userId !== session.user.email) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    // İşin durumunu kontrol et
    if (job.status === 'processing' && data.status !== 'cancelled') {
      return NextResponse.json(
        { error: 'İşlem devam eden bir iş düzenlenemez' },
        { status: 400 }
      );
    }

    // Güncellenebilir alanları kontrol et
    const allowedUpdates = ['name', 'priority', 'settings'];
    const updates = Object.keys(data).filter(key => allowedUpdates.includes(key));

    // Sadece izin verilen alanları güncelle
    updates.forEach(update => {
      job[update] = data[update];
    });

    await job.save();

    return NextResponse.json({
      message: 'İş başarıyla güncellendi',
      job
    });
  } catch (error: any) {
    console.error('İş güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'İş güncellenemedi' },
      { status: 500 }
    );
  }
} 