'use client';

import {
  CloudArrowDownIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function AddNode() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Node Kurulumu</h1>
        <p className="text-gray-500 dark:text-gray-400">Render farmınıza yeni bir node eklemek için aşağıdaki adımları takip edin</p>
      </div>

      <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6">
        <div className="space-y-8">
          {/* İndirme Bölümü */}
          <div className="flex items-start gap-4">
            <CloudArrowDownIcon className="w-8 h-8 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-3 dark:text-white">1. Node Yazılımını İndirin</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <a 
                  href="/downloads/node-windows.zip" 
                  className="flex items-center justify-center px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary"
                >
                  Windows İndir
                </a>
                <a 
                  href="/downloads/node-linux.tar.gz"
                  className="flex items-center justify-center px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary"
                >
                  Linux İndir
                </a>
                <a 
                  href="/downloads/node-macos.dmg"
                  className="flex items-center justify-center px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary"
                >
                  macOS İndir
                </a>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Not: İşletim sisteminize uygun olan sürümü indirin. Tüm sürümler x64 mimarisi içindir.
              </p>
            </div>
          </div>

          {/* Kurulum Talimatları */}
          <div className="flex items-start gap-4">
            <DocumentTextIcon className="w-8 h-8 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-3 dark:text-white">2. Kurulum Adımları</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium mb-2 dark:text-white">Windows</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>İndirdiğiniz ZIP dosyasını çıkarın</li>
                    <li>setup.exe dosyasını yönetici olarak çalıştırın</li>
                    <li>Kurulum sihirbazını takip edin</li>
                    <li>Sistem tepsisindeki node ikonuna sağ tıklayıp "Bağlan" seçeneğini seçin</li>
                  </ol>
                </div>

                <div className="p-4 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium mb-2 dark:text-white">Linux</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>Terminal'i açın</li>
                    <li>İndirilen dosyayı çıkarın: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">tar -xzf node-linux.tar.gz</code></li>
                    <li>Kurulum scriptini çalıştırın: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">sudo ./install.sh</code></li>
                    <li>Servisi başlatın: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">sudo systemctl start boardfarm-node</code></li>
                  </ol>
                </div>

                <div className="p-4 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium mb-2 dark:text-white">macOS</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>DMG dosyasını açın</li>
                    <li>BoardFarm Node uygulamasını Applications klasörüne sürükleyin</li>
                    <li>Uygulamayı çalıştırın ve sistem tercihlerinden izinleri onaylayın</li>
                    <li>Menü çubuğundaki node ikonuna tıklayıp "Bağlan" seçeneğini seçin</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* SSS */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-400 flex-shrink-0">?</div>
            <div>
              <h3 className="font-medium mb-3 dark:text-white">Sıkça Sorulan Sorular</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1 dark:text-white">Node'um ne kadar kaynak kullanacak?</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Node yazılımı, sisteminizin boşta kalan kaynaklarını kullanır. Ayarlar menüsünden CPU, RAM ve GPU kullanım limitlerini belirleyebilirsiniz.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 dark:text-white">Node'u nasıl durdurabilirim?</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sistem tepsisi/menü çubuğundaki node ikonuna tıklayıp "Durdur" seçeneğini kullanabilirsiniz. Linux'ta: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">sudo systemctl stop boardfarm-node</code>
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 dark:text-white">Node'um çevrimiçi görünmüyor?</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ağ ayarlarınızı kontrol edin. Node yazılımının güvenlik duvarından geçişine izin verildiğinden emin olun. Sorun devam ederse logları kontrol edin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 