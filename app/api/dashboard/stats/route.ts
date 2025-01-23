import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { Project, IProject } from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      );
    }

    // Kullanıcının projelerini getir
    const projects = await Project.find({ userId: session.user.email })
      .sort({ createdAt: -1 })
      .lean() as IProject[];

    // İstatistikleri hesapla
    const totalRenders = projects.length;
    const activeRenders = projects.filter(p => p.status === 'rendering').length;
    
    // Ortalama render süresini hesapla (tamamlanan projeler için)
    const completedProjects = projects.filter(p => p.status === 'completed');
    const totalRenderTime = completedProjects.reduce((sum, p) => sum + p.renderTime, 0);
    const averageRenderTime = completedProjects.length > 0 
      ? Math.round(totalRenderTime / completedProjects.length) + ' dakika'
      : 'Hesaplanıyor';

    // Başarı oranını hesapla
    const successRate = totalRenders > 0
      ? Math.round((completedProjects.length / totalRenders) * 100)
      : 0;

    // Proje verilerini formatla
    const formattedProjects = projects.map(project => ({
      id: project._id.toString(),
      name: project.name,
      status: project.status,
      progress: project.progress,
      createdAt: project.createdAt,
      frames: project.frames,
      renderTime: project.renderTime + ' dakika'
    }));

    const stats = {
      totalRenders,
      activeRenders,
      averageRenderTime,
      successRate,
      projects: formattedProjects
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard istatistikleri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 