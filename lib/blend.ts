import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

interface BlendInfo {
  isAnimation: boolean;
  startFrame: number;
  endFrame: number;
  renderEngine: string;
  renderDevice: string;
  samples: number;
  resolution: {
    x: number;
    y: number;
    percentage: number;
  };
}

export async function getBlendInfo(filePath: string): Promise<BlendInfo> {
  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'blend_info.py');
    const blenderPath = process.env.BLENDER_PATH || 'blender';
    
    const command = `${blenderPath} --background --python ${scriptPath} -- "${filePath}"`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.error('Blender error:', stderr);
    }
    
    // JSON çıktısını bul
    const jsonMatch = stdout.match(/{.*}/);
    if (!jsonMatch) {
      throw new Error('Blender info could not be parsed');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error getting blend info:', error);
    throw error;
  }
} 