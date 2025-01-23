import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Renderer from '@/models/Renderer';
import User from '@/models/User';

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

    // Kullanıcının rendererlarını getir
    const renderers = await Renderer.find({ userId: session.user.email });
    
    // Kullanıcı bilgilerini getir
    const user = await User.findOne({ email: session.user.email });

    const stats = {
      totalNodes: renderers.length,
      activeNodes: renderers.filter(r => r.status === 'active').length,
      totalRenders: renderers.reduce((sum, r) => sum + r.totalRenders, 0),
      averageUptime: calculateAverageUptime(renderers),
      totalCredits: user?.credits || 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Node istatistikleri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

function calculateAverageUptime(renderers: any[]): string {
  if (renderers.length === 0) return '0%';
  
  const uptimes = renderers.map(r => parseFloat(r.uptime.replace('%', '')) || 0);
  const average = uptimes.reduce((sum, uptime) => sum + uptime, 0) / renderers.length;
  
  return `${average.toFixed(1)}%`;
} 