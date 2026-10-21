import {Config} from '@remotion/cli/config';
import fs from 'fs';

// Video ayarları
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);

// 3D sahneler için grafik motoru (sunucuda ve bilgisayarda çalışır)
Config.setChromiumOpenGlRenderer('angle');

// Bu bulut ortamında hazır tarayıcıyı kullan. Kendi bilgisayarında bu dosya
// yoksa Remotion kendi tarayıcısını otomatik indirir.
const yerelTarayici =
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(yerelTarayici)) {
	Config.setBrowserExecutable(yerelTarayici);
}
