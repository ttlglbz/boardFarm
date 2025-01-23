import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'pfp');

// Yükleme dizininin varlığını kontrol et ve yoksa oluştur
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Dosya adını hash'e çevir
function generateHashFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256')
    .update(`${timestamp}-${randomString}-${originalFilename}`)
    .digest('hex')
    .slice(0, 12); // İlk 12 karakteri al
  
  const extension = path.extname(originalFilename);
  return `${hash}${extension}`;
}

export async function uploadProfilePhoto(file: Buffer, filename: string): Promise<string> {
  try {
    await ensureUploadDir();
    
    // Dosya adını hash'e çevir
    const hashedFilename = generateHashFilename(filename);
    const filePath = path.join(UPLOAD_DIR, hashedFilename);
    
    // Dosyayı kaydet
    await fs.writeFile(filePath, file);
    
    // Public URL'i döndür
    return `/images/pfp/${hashedFilename}`;
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    throw new Error('Profil fotoğrafı yüklenirken bir hata oluştu');
  }
}

export async function deleteProfilePhoto(filename: string): Promise<void> {
  try {
    if (!filename) return;
    
    // Dosya yolunu al
    const filePath = path.join(UPLOAD_DIR, path.basename(filename));
    
    // Dosyanın varlığını kontrol et
    try {
      await fs.access(filePath);
    } catch {
      return; // Dosya zaten yok
    }
    
    // Dosyayı sil
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Dosya silme hatası:', error);
    throw new Error('Profil fotoğrafı silinirken bir hata oluştu');
  }
} 