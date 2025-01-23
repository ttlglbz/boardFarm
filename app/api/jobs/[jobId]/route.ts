import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../lib/db';
import Job from '@/models/Job';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/route';

interface Params {
  params: {
    jobId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Kullanıcıyı bul
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // İşi bul ve renderer bilgilerini popüle et
    const job = await Job.findById(params.jobId)
      .populate('renderers.nodeId', 'name specs performance');

    if (!job) {
      return NextResponse.json(
        { error: 'İş bulunamadı' },
        { status: 404 }
      );
    }

    // İşin sahibi olup olmadığını kontrol et
    if (job.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Bu işe erişim yetkiniz yok' },
        { status: 403 }
      );
    }

    return NextResponse.json(job);
  } catch (error: any) {
    console.error('İş detayı getirme hatası:', error);
    return NextResponse.json(
      { error: 'İş detayları getirilemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { action } = await req.json();

    await dbConnect();

    // Kullanıcıyı bul
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // İşi bul
    const job = await Job.findById(params.jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'İş bulunamadı' },
        { status: 404 }
      );
    }

    // İşin sahibi olup olmadığını kontrol et
    if (job.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Bu işe erişim yetkiniz yok' },
        { status: 403 }
      );
    }

    // İşlem türüne göre güncelleme yap
    switch (action) {
      case 'pause':
        if (job.status !== 'rendering') {
          return NextResponse.json(
            { error: 'Sadece render edilmekte olan işler duraklatılabilir' },
            { status: 400 }
          );
        }
        job.status = 'paused';
        break;

      case 'resume':
        if (job.status !== 'paused') {
          return NextResponse.json(
            { error: 'Sadece duraklatılmış işler devam ettirilebilir' },
            { status: 400 }
          );
        }
        job.status = 'rendering';
        break;

      case 'cancel':
        if (['completed', 'failed'].includes(job.status)) {
          return NextResponse.json(
            { error: 'Tamamlanmış veya başarısız olmuş işler iptal edilemez' },
            { status: 400 }
          );
        }
        job.status = 'failed';
        job.endTime = new Date();

        // Kullanıcıya kredilerini iade et
        const completedFrames = job.renderedFrames.filter((f: { status: string; }) => f.status === 'completed').length;
        const refundAmount = job.estimatedCost * ((job.totalFrames - completedFrames) / job.totalFrames);
        user.credits += refundAmount;
        await user.save();
        break;

      default:
        return NextResponse.json(
          { error: 'Geçersiz işlem' },
          { status: 400 }
        );
    }

    await job.save();
    return NextResponse.json(job);
  } catch (error: any) {
    console.error('İş güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'İş güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Kullanıcıyı bul
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // İşi bul
    const job = await Job.findById(params.jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'İş bulunamadı' },
        { status: 404 }
      );
    }

    // İşin sahibi olup olmadığını kontrol et
    if (job.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Bu işe erişim yetkiniz yok' },
        { status: 403 }
      );
    }

    // Aktif işler silinemez
    if (['pending', 'rendering'].includes(job.status)) {
      return NextResponse.json(
        { error: 'Aktif işler silinemez' },
        { status: 400 }
      );
    }

    await job.deleteOne();
    return NextResponse.json({ message: 'İş silindi' });
  } catch (error: any) {
    console.error('İş silme hatası:', error);
    return NextResponse.json(
      { error: 'İş silinemedi' },
      { status: 500 }
    );
  }
} 