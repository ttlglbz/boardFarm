import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Renderer, { IRenderer } from '@/models/Renderer';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      );
    }

    await dbConnect();

    const renderers = await Renderer.find({ userId: session.user.email }).lean() as IRenderer[];
    const total = renderers.length;

    const formattedRenderers = renderers.map(renderer => ({
      id: renderer._id.toString(),
      name: renderer.name,
      status: renderer.status,
      currentJob: renderer.currentJob
    }));

    return NextResponse.json({
      renderers: formattedRenderers,
      total
    });

  } catch (error) {
    console.error('Node listesi getirme hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 