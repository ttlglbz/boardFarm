import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User, { IUser } from '@/models/User';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await dbConnect();
    const username = (await params).username;

    const user = await User.findOne({ username }).select('-password').lean() as unknown as IUser;

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcı verilerini formatla
    const userData = {
      username: user.username || null,
      email: user.email,
      role: user.role || 'user',
      credits: user.credits || 0,
      totalRenders: user.totalRenders || 0,
      successRate: user.successRate || 100,
      activeNodes: user.activeNodes || 0,
      joinDate: user.createdAt,
      lastLogin: user.lastLogin || user.createdAt,
      recentJobs: user.recentJobs || [],
      stats: {
        totalRenderTime: user.totalRenderTime || '0 saat',
        averageRenderTime: user.averageRenderTime || '0 dakika',
        totalFrames: user.totalFrames || 0,
        failedFrames: user.failedFrames || 0,
      },
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Kullanıcı profili getirme hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 