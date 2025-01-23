import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import Renderer from '@/models/Renderer';
import { authOptions } from '../../auth/[...nextauth]/route';

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
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Aktif işleri getir
    const activeJobs = await Job.find({
      userId: session.user?.email,
      status: { $in: ['pending', 'processing'] }
    }).lean();

    // Tamamlanan işleri getir (son 30 gün)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const completedJobs = await Job.find({
      userId: session.user?.email,
      status: 'completed',
      createdAt: { $gte: thirtyDaysAgo }
    }).lean();

    // Başarısız işleri getir (son 30 gün)
    const failedJobs = await Job.find({
      userId: session.user?.email,
      status: 'failed',
      createdAt: { $gte: thirtyDaysAgo }
    }).lean();

    // Aktif rendererları getir
    const activeRenderers = await Renderer.find({
      userId: session.user?.email,
      status: { $in: ['online', 'busy'] }
    }).lean();

    // İstatistikleri hesapla
    const stats = {
      activeJobs: activeJobs.length,
      completedJobs: completedJobs.length,
      failedJobs: failedJobs.length,
      successRate: completedJobs.length + failedJobs.length > 0
        ? (completedJobs.length / (completedJobs.length + failedJobs.length) * 100).toFixed(1)
        : 100,
      activeRenderers: activeRenderers.length,
      totalRenderers: await Renderer.countDocuments({ userId: session.user?.email }),
      averageJobDuration: completedJobs.length > 0
        ? completedJobs.reduce((acc, job) => {
            if (job.startTime && job.endTime) {
              return acc + (new Date(job.endTime).getTime() - new Date(job.startTime).getTime());
            }
            return acc;
          }, 0) / completedJobs.length / 1000 / 60 // dakika cinsinden
        : 0,
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('İstatistik getirme hatası:', error);
    return NextResponse.json(
      { error: 'İstatistikler alınamadı' },
      { status: 500 }
    );
  }
} 